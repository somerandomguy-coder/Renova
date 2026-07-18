"""
RENOVA AI RAG — Engine

Core RAG pipeline: retrieve relevant context from ChromaDB,
then generate a response using any LLM provider.

- Ollama: Uses native /api/chat endpoint (properly supports think: false)
- OpenAI/Gemini: Uses OpenAI SDK (OpenAI-compatible API)
"""

import re
import json
import urllib.request
import urllib.error

from ai.rag.config import get_config
from ai.rag.vector_store import search


def _strip_thinking_tags(text: str) -> str:
    """Strip thinking/reasoning output from thinking models (Qwen 3.5, DeepSeek R1, etc.)."""
    # Remove <think>...</think> XML blocks (including multiline)
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    return cleaned if cleaned else text


def _call_ollama_native(messages: list[dict], config) -> str:
    """Call Ollama's native /api/chat endpoint with think=false."""
    # Derive Ollama base from the OpenAI-compatible URL
    # e.g., http://localhost:11434/v1 -> http://localhost:11434
    ollama_base = config.llm_base_url.replace("/v1", "").rstrip("/")
    url = f"{ollama_base}/api/chat"

    payload = json.dumps({
        "model": config.llm_model,
        "messages": messages,
        "stream": False,
        "think": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 1024,
        },
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    return data.get("message", {}).get("content", "")


def _call_openai_compatible(messages: list[dict], config) -> str:
    """Call OpenAI/Gemini via the OpenAI SDK."""
    from openai import OpenAI

    client = OpenAI(
        base_url=config.llm_base_url,
        api_key=config.llm_api_key,
    )

    response = client.chat.completions.create(
        model=config.llm_model,
        messages=messages,
        temperature=0.3,
        max_tokens=1024,
    )

    return response.choices[0].message.content or ""


def _build_context_prompt(retrieved_docs: list[dict]) -> str:
    """Format retrieved documents into a context block for the LLM."""
    if not retrieved_docs:
        return "No relevant context found in the knowledge base."

    context_parts = []
    for i, doc in enumerate(retrieved_docs, 1):
        context_parts.append(
            f"[Source: {doc['source']}]\n{doc['content']}"
        )

    return "\n\n---\n\n".join(context_parts)


def ask(
    question: str,
    chat_history: list[dict] | None = None,
) -> dict:
    """
    Answer a question using RAG (Retrieve -> Augment -> Generate).

    Args:
        question: The user's question.
        chat_history: List of {"role": "user"|"assistant", "content": str}.

    Returns:
        Dict with keys: 'reply', 'sources' (list of source names).
    """
    config = get_config()

    # Step 1: Retrieve relevant context from ChromaDB
    retrieved = search(question, top_k=config.top_k)

    # Collect unique source names
    sources = list(dict.fromkeys(doc["source"] for doc in retrieved))

    # Step 2: Build the augmented prompt
    context_text = _build_context_prompt(retrieved)

    # Step 3: Assemble the messages array
    messages = [
        {"role": "system", "content": config.system_prompt},
    ]

    # Include chat history (keep last 10 turns to stay within context window)
    if chat_history:
        for msg in chat_history[-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

    # The current question with retrieved context
    user_message = f"""Based on the following context from the RENOVA knowledge base, answer the user's question.

CONTEXT:
{context_text}

USER QUESTION:
{question}"""

    messages.append({"role": "user", "content": user_message})

    # Step 4: Generate response from LLM
    try:
        if config.llm_provider == "ollama":
            reply = _call_ollama_native(messages, config)
        else:
            reply = _call_openai_compatible(messages, config)

        reply = _strip_thinking_tags(reply)

        if not reply:
            reply = "I couldn't generate a response. Please try again."

    except (urllib.error.URLError, ConnectionError) as e:
        reply = (
            "Cannot connect to the AI model. "
            "Please ensure Ollama is running (ollama serve) or check your LLM provider configuration.\n\n"
            "Khong the ket noi den mo hinh AI. "
            "Vui long dam bao Ollama dang chay (ollama serve) hoac kiem tra cau hinh nha cung cap LLM."
        )
        sources = []
    except Exception as e:
        reply = f"AI Error: {str(e)}"
        sources = []

    return {
        "reply": reply,
        "sources": sources,
    }
