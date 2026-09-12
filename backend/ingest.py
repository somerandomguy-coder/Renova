"""
ECOVAL Backend — RAG Ingestion Helper Script

Ensures the project root is on sys.path and runs ai.rag.ingest.
Allows Render and local servers to execute ingestion directly inside the backend directory.
"""

import sys
import os

# Add project root to sys.path so 'ai' package can be imported from any working directory
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ai.rag.ingest import ingest_knowledge

if __name__ == "__main__":
    try:
        ingest_knowledge()
    except Exception as e:
        print(f"[INGEST ERROR] Failed to ingest knowledge base: {e}")
        print("[INGEST] Continuing startup anyway to avoid blocking container deployment.")
