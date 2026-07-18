"""
RENOVA AI RAG — Document Ingestion

Reads markdown files from the knowledge directory, chunks them,
and stores embeddings in ChromaDB.

Usage:
    python -m ai.rag.ingest
"""

import os
import re
import hashlib

from ai.rag.config import get_config
from ai.rag.vector_store import reset_collection


def _chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into overlapping chunks, breaking on paragraph boundaries.
    chunk_size and overlap are in approximate word counts.
    """
    # Split into paragraphs first
    paragraphs = re.split(r"\n\s*\n", text.strip())

    chunks = []
    current_chunk: list[str] = []
    current_word_count = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        para_words = len(para.split())

        # If adding this paragraph would exceed chunk_size, finalize current chunk
        if current_word_count + para_words > chunk_size and current_chunk:
            chunks.append("\n\n".join(current_chunk))

            # Overlap: keep the last paragraph(s) that fit within overlap
            overlap_paras: list[str] = []
            overlap_count = 0
            for p in reversed(current_chunk):
                p_words = len(p.split())
                if overlap_count + p_words <= overlap:
                    overlap_paras.insert(0, p)
                    overlap_count += p_words
                else:
                    break

            current_chunk = overlap_paras
            current_word_count = overlap_count

        current_chunk.append(para)
        current_word_count += para_words

    # Don't forget the last chunk
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    return chunks


def ingest_knowledge():
    """
    Read all .md files from the knowledge directory, chunk them,
    and store in ChromaDB.
    """
    config = get_config()
    knowledge_dir = config.knowledge_dir

    if not os.path.isdir(knowledge_dir):
        print(f"[INGEST] Knowledge directory not found: {knowledge_dir}")
        return

    # Reset the collection for a clean re-ingest
    collection = reset_collection()

    all_ids: list[str] = []
    all_documents: list[str] = []
    all_metadatas: list[dict] = []

    md_files = sorted(
        f for f in os.listdir(knowledge_dir) if f.endswith(".md")
    )

    if not md_files:
        print(f"[INGEST] No .md files found in {knowledge_dir}")
        return

    for filename in md_files:
        filepath = os.path.join(knowledge_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = _chunk_text(content, config.chunk_size, config.chunk_overlap)
        source_name = filename.replace(".md", "").replace("_", " ").title()

        print(f"[INGEST] {filename}: {len(chunks)} chunks")

        for i, chunk in enumerate(chunks):
            # Deterministic ID from content hash for idempotency
            chunk_id = hashlib.md5(f"{filename}:{i}:{chunk[:100]}".encode()).hexdigest()
            all_ids.append(chunk_id)
            all_documents.append(chunk)
            all_metadatas.append(
                {
                    "source": source_name,
                    "filename": filename,
                    "chunk_index": i,
                }
            )

    # Batch upsert into ChromaDB
    if all_documents:
        # ChromaDB has a batch limit, process in batches of 100
        batch_size = 100
        for start in range(0, len(all_documents), batch_size):
            end = start + batch_size
            collection.add(
                ids=all_ids[start:end],
                documents=all_documents[start:end],
                metadatas=all_metadatas[start:end],
            )

        print(f"[INGEST] DONE: {len(all_documents)} chunks from {len(md_files)} files ingested.")
    else:
        print("[INGEST] WARNING: No chunks generated.")


if __name__ == "__main__":
    try:
        ingest_knowledge()
    except Exception as e:
        print(f"[INGEST ERROR] Failed to ingest knowledge base: {e}")
        print("[INGEST] Continuing startup anyway to avoid blocking container deployment.")
