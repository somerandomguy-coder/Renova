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

# Safe Langfuse observe import
try:
    from langfuse.decorators import observe, langfuse_context
    LANGFUSE_AVAILABLE = True
except ImportError:
    LANGFUSE_AVAILABLE = False
    langfuse_context = None
    def observe(*args, **kwargs):
        if len(args) == 1 and callable(args[0]):
            return args[0]
        def decorator(func):
            return func
        return decorator

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


@observe(name="vector_store_search")
def search(query: str, top_k: int | None = None) -> list[dict]:
    """
    Search the vector store for relevant document chunks.
    Instrumented with Langfuse tracing when available.
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

    if LANGFUSE_AVAILABLE and 'langfuse_context' in globals() and langfuse_context:
        try:
            langfuse_context.update_current_observation(
                input={"query": query, "top_k": k},
                output={"documents_count": len(documents), "sources": list(dict.fromkeys(d['source'] for d in documents))}
            )
        except Exception:
            pass

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
