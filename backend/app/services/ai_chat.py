"""
RENOVA Backend — AI Chat Service

Thin service layer that initializes the RAG engine and handles chat requests.
Isolates the AI logic from the FastAPI route handlers.
"""

import sys
import os

# Add project root to Python path so we can import the ai package
_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)


def chat(message: str, history: list[dict] | None = None) -> dict:
    """
    Process a chat message through the RAG pipeline.

    Args:
        message: The user's question.
        history: List of {"role": "user"|"assistant", "content": str}.

    Returns:
        Dict with 'reply' (str) and 'sources' (list[str]).
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
                "⚠️ AI module not available. Please install AI dependencies: "
                "`pip install -r ai/requirements.txt`\n\n"
                f"Error: {str(e)}"
            ),
            "sources": [],
        }
    except Exception as e:
        return {
            "reply": f"⚠️ An error occurred while processing your question: {str(e)}",
            "sources": [],
        }
