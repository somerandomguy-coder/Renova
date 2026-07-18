"""
RENOVA AI RAG — Engine

Core RAG pipeline: retrieve relevant context from ChromaDB,
then generate a response using any LLM provider.

Supports two modes:
  - ask()         → Full response (backward compatible)
  - ask_stream()  → Generator yielding SSE-formatted chunks for streaming
"""

import re
import json
import urllib.request
import urllib.error
from typing import Generator

from ai.rag.config import get_config
from ai.rag.vector_store import search


def _strip_thinking_tags(text: str) -> str:
    """Strip thinking/reasoning output from thinking models (Qwen 3.5, DeepSeek R1, etc.)."""
    # Remove <think>...</think> XML blocks (including multiline)
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    return cleaned if cleaned else text


# ─── NON-STREAMING LLM CALLS ────────────────────────────────────────────────

def _call_ollama_native(messages: list[dict], config) -> str:
    """Call Ollama's native /api/chat endpoint with think=false."""
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
        url, data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    return data.get("message", {}).get("content", "")


def _call_openai_compatible(messages: list[dict], config) -> str:
    """Call OpenAI/Groq/Gemini via the OpenAI SDK."""
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


# ─── STREAMING LLM CALLS ────────────────────────────────────────────────────

def _stream_ollama_native(messages: list[dict], config) -> Generator[str, None, None]:
    """Stream from Ollama's native /api/chat endpoint."""
    ollama_base = config.llm_base_url.replace("/v1", "").rstrip("/")
    url = f"{ollama_base}/api/chat"

    payload = json.dumps({
        "model": config.llm_model,
        "messages": messages,
        "stream": True,
        "think": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 1024,
        },
    }).encode("utf-8")

    req = urllib.request.Request(
        url, data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        for line in resp:
            line = line.decode("utf-8").strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                content = data.get("message", {}).get("content", "")
                if content:
                    yield content
            except json.JSONDecodeError:
                continue


def _stream_openai_compatible(messages: list[dict], config) -> Generator[str, None, None]:
    """Stream from OpenAI/Groq/Gemini via the OpenAI SDK."""
    from openai import OpenAI

    client = OpenAI(
        base_url=config.llm_base_url,
        api_key=config.llm_api_key,
    )

    stream = client.chat.completions.create(
        model=config.llm_model,
        messages=messages,
        temperature=0.3,
        max_tokens=1024,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta if chunk.choices else None
        if delta and delta.content:
            yield delta.content


# ─── SHARED HELPERS ──────────────────────────────────────────────────────────

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


def _prepare_messages(
    question: str,
    chat_history: list[dict] | None,
    config,
) -> tuple[list[dict], list[str]]:
    """Retrieve context and build the messages array.

    Returns (messages, sources).
    """
    # Step 1: Retrieve relevant context from ChromaDB
    retrieved = search(question, top_k=config.top_k)
    sources = list(dict.fromkeys(doc["source"] for doc in retrieved))

    # Step 2: Build the augmented prompt
    context_text = _build_context_prompt(retrieved)

    # Step 3: Assemble the messages array
    messages = [
        {"role": "system", "content": config.system_prompt},
    ]

    if chat_history:
        for msg in chat_history[-10:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

    user_message = f"""Based on the following context from the RENOVA knowledge base, answer the user's question.

CONTEXT:
{context_text}

USER QUESTION:
{question}"""

    messages.append({"role": "user", "content": user_message})
    return messages, sources


# ─── PUBLIC API ──────────────────────────────────────────────────────────────

def ask(
    question: str,
    chat_history: list[dict] | None = None,
) -> dict:
    """
    Answer a question using RAG (non-streaming, backward compatible).

    Returns Dict with keys: 'reply', 'sources'.
    """
    config = get_config()
    messages, sources = _prepare_messages(question, chat_history, config)

    try:
        if config.llm_provider == "ollama":
            reply = _call_ollama_native(messages, config)
        else:
            reply = _call_openai_compatible(messages, config)

        reply = _strip_thinking_tags(reply)

        if not reply:
            reply = "I couldn't generate a response. Please try again."

    except (urllib.error.URLError, ConnectionError):
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


def ask_stream(
    question: str,
    chat_history: list[dict] | None = None,
) -> Generator[str, None, None]:
    """
    Answer a question using RAG with SSE streaming.

    Yields SSE-formatted lines:
      data: {"type": "sources", "sources": [...]}
      data: {"type": "token", "token": "..."}
      data: {"type": "done"}
      data: {"type": "error", "message": "..."}
    """
    config = get_config()

    try:
        messages, sources = _prepare_messages(question, chat_history, config)

        # First event: send sources so the UI can display them immediately
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"

        # Stream tokens from the LLM
        if config.llm_provider == "ollama":
            token_gen = _stream_ollama_native(messages, config)
        else:
            token_gen = _stream_openai_compatible(messages, config)

        # Buffer to strip thinking tags from streamed output
        buffer = ""
        thinking_stripped = False

        for token in token_gen:
            buffer += token

            # Check for <think> tags in the buffer
            if "<think>" in buffer and not thinking_stripped:
                # Wait until we see </think> before emitting anything
                if "</think>" in buffer:
                    buffer = re.sub(r"<think>.*?</think>", "", buffer, flags=re.DOTALL).strip()
                    thinking_stripped = True
                else:
                    continue  # Keep buffering

            # If we've passed the thinking section or there's no thinking, emit tokens
            if thinking_stripped or "<think>" not in buffer:
                if buffer:
                    yield f"data: {json.dumps({'type': 'token', 'token': buffer})}\n\n"
                    buffer = ""

        # Flush any remaining buffer
        if buffer:
            cleaned = _strip_thinking_tags(buffer)
            if cleaned:
                yield f"data: {json.dumps({'type': 'token', 'token': cleaned})}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except (urllib.error.URLError, ConnectionError):
        yield f"data: {json.dumps({'type': 'error', 'message': 'Cannot connect to the AI model.'})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
