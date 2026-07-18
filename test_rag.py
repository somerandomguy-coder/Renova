"""Quick test script for the RAG chatbot (Windows-safe encoding)."""
import sys, os, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.path.insert(0, os.path.dirname(__file__))

from ai.rag.engine import ask

# Test 1: English question
print("=" * 50)
print("TEST 1: English - Product specs")
print("=" * 50)
result = ask("What is the compressive strength of Gen3 Heritage breeze blocks?")
print(f"Reply: {result['reply'][:800]}")
print(f"Sources: {result['sources']}")

print()

# Test 2: Vietnamese question
print("=" * 50)
print("TEST 2: Vietnamese - RENOVA")
print("=" * 50)
result = ask("RENOVA la gi?")
print(f"Reply: {result['reply'][:800]}")
print(f"Sources: {result['sources']}")
