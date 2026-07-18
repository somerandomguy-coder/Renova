"""
RENOVA Backend — AI Chat Service

Thin service layer that initializes the RAG engine and handles chat requests.
Supports both full response and streaming modes.
"""

import sys
import os
from typing import Generator

# Add project root to Python path so we can import the ai package
_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)


def chat(message: str, history: list[dict] | None = None) -> dict:
    """
    Process a chat message through the RAG pipeline (non-streaming).

    Returns Dict with 'reply' (str) and 'sources' (list[str]).
    """
    try:
        from ai.rag.engine import ask

        result = ask(
            question=message,
            chat_history=history,
        )
        return result

    except ImportError as e:
        return {
            "reply": (
                "AI module not available. Please install AI dependencies: "
                "`pip install -r ai/requirements.txt`\n\n"
                f"Error: {str(e)}"
            ),
            "sources": [],
        }
    except Exception as e:
        return {
            "reply": f"An error occurred while processing your question: {str(e)}",
            "sources": [],
        }


def chat_stream(message: str, history: list[dict] | None = None) -> Generator[str, None, None]:
    """
    Process a chat message through the RAG pipeline with SSE streaming.

    Yields SSE-formatted event strings.
    """
    try:
        from ai.rag.engine import ask_stream

        yield from ask_stream(
            question=message,
            chat_history=history,
        )

    except ImportError as e:
        import json
        yield f"data: {json.dumps({'type': 'error', 'message': f'AI module not available: {str(e)}'})}\n\n"
    except Exception as e:
        import json
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
