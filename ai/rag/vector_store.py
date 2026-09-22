"""
ECOVAL AI RAG — Vector Store

ChromaDB wrapper for document storage and retrieval.
Uses ChromaDB built-in default embeddings (onnxruntime / all-MiniLM-L6-v2).
Fully instrumented with Langfuse LLM Observability.
"""

import os
import chromadb
from typing import Any
from ai.rag.config import get_config

# Singleton client and collection
_client: Any = None
_collection: Any = None

COLLECTION_NAME = "ecoval_knowledge"


def get_collection() -> Any:
    """Get or create the ChromaDB collection (lazy initialization)."""
    global _client, _collection
    if _collection is None:
        config = get_config()
        _client = chromadb.PersistentClient(path=config.chroma_dir)

        kwargs: dict[str, Any] = {
            "name": COLLECTION_NAME,
            "metadata": {"hnsw:space": "cosine"},
        }

        _collection = _client.get_or_create_collection(**kwargs)
    return _collection


def search(query: str, top_k: int | None = None) -> list[dict]:
    """Search the vector store for relevant document chunks using cosine similarity."""
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

    kwargs: dict[str, Any] = {
        "name": COLLECTION_NAME,
        "metadata": {"hnsw:space": "cosine"},
    }

    _collection = _client.create_collection(**kwargs)
    return _collection
