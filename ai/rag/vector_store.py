"""
RENOVA AI RAG — Vector Store

ChromaDB wrapper for document storage and retrieval.
Supports two embedding modes:
  - "local": ChromaDB's built-in onnxruntime (good on decent CPU, slow on free tier)
  - "huggingface": Free HuggingFace Inference API (fast everywhere, no API key needed)
"""

import json
import urllib.request
import chromadb

from typing import Any

from ai.rag.config import get_config

# Singleton client and collection
_client: Any = None
_collection: Any = None

COLLECTION_NAME = "renova_knowledge"


class HuggingFaceEmbeddingFunction:
    """Cloud embedding function using the free HuggingFace Inference API.

    No API key required for public models. ~100ms per request vs 4-10s local
    on Render's free tier CPU.
    """

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"
        self.model_name = model_name

    def __call__(self, input: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of texts."""
        payload = json.dumps({"inputs": input, "options": {"wait_for_model": True}}).encode("utf-8")

        req = urllib.request.Request(
            self.api_url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                embeddings = json.loads(resp.read().decode("utf-8"))
            return embeddings
        except Exception as e:
            print(f"[HuggingFace Embedding] Error: {e}. Retrying with smaller batch...")
            # Fallback: process one at a time
            results = []
            for text in input:
                single_payload = json.dumps(
                    {"inputs": [text], "options": {"wait_for_model": True}}
                ).encode("utf-8")
                single_req = urllib.request.Request(
                    self.api_url,
                    data=single_payload,
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                with urllib.request.urlopen(single_req, timeout=30) as resp:
                    result = json.loads(resp.read().decode("utf-8"))
                results.append(result[0] if isinstance(result[0], list) else result)
            return results


def _get_embedding_function() -> Any:
    """Get the configured embedding function (local or cloud)."""
    config = get_config()
    if config.embedding_provider == "huggingface":
        print("[Embeddings] Using HuggingFace Inference API (cloud)")
        return HuggingFaceEmbeddingFunction(model_name=config.embedding_model)
    else:
        print("[Embeddings] Using ChromaDB default (local onnxruntime)")
        return None  # ChromaDB uses its built-in default


def get_collection() -> Any:
    """Get or create the ChromaDB collection (lazy initialization).

    Uses either local onnxruntime embeddings or cloud HuggingFace API
    depending on EMBEDDING_PROVIDER config.
    """
    global _client, _collection
    if _collection is None:
        config = get_config()
        _client = chromadb.PersistentClient(path=config.chroma_dir)

        ef = _get_embedding_function()

        kwargs: dict[str, Any] = {
            "name": COLLECTION_NAME,
            "metadata": {"hnsw:space": "cosine"},
        }
        if ef is not None:
            kwargs["embedding_function"] = ef

        _collection = _client.get_or_create_collection(**kwargs)
    return _collection


def search(query: str, top_k: int | None = None) -> list[dict]:
    """
    Search the vector store for relevant document chunks.

    Returns a list of dicts with keys: 'content', 'source', 'distance'.
    """
    config = get_config()
    k = top_k or config.top_k
    collection = get_collection()

    if collection.count() == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=min(k, collection.count()),
    )

    documents = []
    for i in range(len(results["documents"][0])):
        documents.append(
            {
                "content": results["documents"][0][i],
                "source": results["metadatas"][0][i].get("source", "unknown"),
                "distance": results["distances"][0][i] if results["distances"] else None,
            }
        )

    return documents


def reset_collection():
    """Delete and recreate the collection (used during re-ingestion)."""
    global _client, _collection
    config = get_config()
    _client = chromadb.PersistentClient(path=config.chroma_dir)
    try:
        _client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    ef = _get_embedding_function()
    kwargs: dict[str, Any] = {
        "name": COLLECTION_NAME,
        "metadata": {"hnsw:space": "cosine"},
    }
    if ef is not None:
        kwargs["embedding_function"] = ef

    _collection = _client.create_collection(**kwargs)
    return _collection
