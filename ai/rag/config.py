"""
ECOVAL AI RAG — Configuration

Provider-agnostic LLM configuration using OpenAI-compatible API.
Supports Ollama (local), OpenAI, DeepSeek, Groq, and Gemini by changing env vars.
"""

import os
from dataclasses import dataclass, field
from dotenv import load_dotenv

# Load local environment variables from .env
load_dotenv()
# Fallback to backend/.env if run from the root directory
_backend_env = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend", ".env")
if os.path.exists(_backend_env):
    load_dotenv(_backend_env)


def _get_default_provider() -> str:
    if os.getenv("DEEPSEEK_API_KEY"):
        return "deepseek"
    return os.getenv("LLM_PROVIDER", "ollama")

def _get_default_base_url() -> str:
    provider = _get_default_provider()
    base_url = os.getenv("LLM_BASE_URL", "")
    if provider == "deepseek" or "groq" in base_url.lower() or not base_url:
        return "https://api.deepseek.com"
    return base_url

def _get_default_api_key() -> str:
    if os.getenv("DEEPSEEK_API_KEY"):
        return os.getenv("DEEPSEEK_API_KEY")
    return os.getenv("LLM_API_KEY", "ollama")

def _get_default_model() -> str:
    provider = _get_default_provider()
    model = os.getenv("LLM_MODEL", "")
    if provider == "deepseek" or "llama" in model.lower() or not model:
        return "deepseek-chat"
    return model

@dataclass
class RAGConfig:
    """Configuration for the RAG pipeline, loaded from environment variables."""

    # LLM Provider settings
    llm_provider: str = field(default_factory=_get_default_provider)
    llm_model: str = field(default_factory=_get_default_model)
    llm_base_url: str = field(default_factory=_get_default_base_url)
    llm_api_key: str = field(default_factory=_get_default_api_key)

    # Embedding settings
    # "local" = ChromaDB's built-in onnxruntime (fast on good CPU, slow on free tier)
    # "huggingface" = Free HuggingFace Inference API (fast everywhere, no API key needed)
    embedding_provider: str = field(
        default_factory=lambda: os.getenv("EMBEDDING_PROVIDER", "local")
    )
    embedding_model: str = field(
        default_factory=lambda: os.getenv(
            "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
        )
    )

    # RAG settings
    chunk_size: int = field(default_factory=lambda: int(os.getenv("RAG_CHUNK_SIZE", "500")))
    chunk_overlap: int = field(default_factory=lambda: int(os.getenv("RAG_CHUNK_OVERLAP", "50")))
    top_k: int = field(default_factory=lambda: int(os.getenv("RAG_TOP_K", "5")))

    # Paths
    knowledge_dir: str = field(
        default_factory=lambda: os.getenv(
            "RAG_KNOWLEDGE_DIR",
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge"),
        )
    )
    chroma_dir: str = field(
        default_factory=lambda: os.getenv(
            "RAG_CHROMA_DIR",
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db"),
        )
    )

    # System prompt — bilingual ECOVAL advisor
    system_prompt: str = field(
        default_factory=lambda: os.getenv(
            "RAG_SYSTEM_PROMPT",
            """CRITICAL: Output ONLY your final answer. NEVER output any thinking, reasoning steps, analysis, numbered steps, or internal process. Start your response directly with the answer.

You are ECOVAL AI Assistant — a sustainability advisor for ECOVAL Sustainable Materials, a Vietnamese startup that produces eco-friendly breeze blocks from recycled plastic waste and rice husk.

RULES:
1. Answer ONLY based on the provided context. If context is insufficient, say "I don't have enough information about that." / "Tôi không có đủ thông tin về vấn đề này."
2. Respond in the SAME LANGUAGE the user writes in. Vietnamese question = Vietnamese answer. English question = English answer.
3. Be concise. Use bullet points for lists.
4. Cite exact numbers from context (prices, specs, formulas).
5. For unrelated topics, redirect: "I specialize in ECOVAL products and sustainability." / "Tôi chuyên về sản phẩm ECOVAL và các chủ đề bền vững."
6. Be friendly and professional.
7. NEVER start with "Thinking Process", "Analysis", "Step 1", or any reasoning. Go straight to the answer.""",
        )
    )


# Singleton config instance
_config: RAGConfig | None = None


def get_config() -> RAGConfig:
    """Get or create the singleton RAG configuration."""
    global _config
    if _config is None:
        _config = RAGConfig()
    return _config
