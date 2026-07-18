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
    """Cloud embedding function using the official HuggingFace Inference Client SDK.

    No API key required for public models, but HF_TOKEN is recommended to avoid rate limits.
    """

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name

    def __call__(self, input: list[str]) -> list[list[float]]:
        """Generate embeddings using the official InferenceClient."""
        import os
        from huggingface_hub import InferenceClient

        hf_token = os.getenv("HF_API_KEY") or os.getenv("HF_TOKEN")
        client = InferenceClient(api_key=hf_token)

        try:
            embeddings = client.feature_extraction(input, model=self.model_name)
            
            # The SDK returns a NumPy array or list. Convert to a list of lists of floats.
            if hasattr(embeddings, "tolist"):
                return embeddings.tolist()
            elif isinstance(embeddings, list):
                return [list(emb) if hasattr(emb, "__iter__") else emb for emb in embeddings]
            return embeddings
        except Exception as e:
            print(f"[HuggingFace SDK] Batch embedding failed: {e}. Trying single fallback...")
            results = []
            for text in input:
                emb = client.feature_extraction(text, model=self.model_name)
                if hasattr(emb, "tolist"):
                    emb = emb.tolist()
                results.append(emb)
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
