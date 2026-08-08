"""
DeepSeek API Customer Q&A Benchmark Suite for ECOVAL RAG

Evaluates 10 realistic customer inquiry scenarios against the local RAG engine.
Measures latency (TTFT, Total s), token usage, estimated DeepSeek API cost ($0.14/1M input, $0.28/1M output), and answer accuracy.
"""

import time
import json
import os
import sys
from typing import List, Dict

sys.stdout.reconfigure(encoding='utf-8')

# Import RAG engine directly
from ai.rag.engine import ask_stream, ask

BENCHMARK_QUESTIONS = [
    {
        "id": 1,
        "category": "Material & Formula",
        "question": "Gạch bông gió ECOVAL làm từ nguyên liệu gì và tỷ lệ phối trộn ra sao?",
        "expected_keywords": ["70%", "25%", "5%", "nhựa", "vỏ trấu"]
    },
    {
        "id": 2,
        "category": "Physical Strength",
        "question": "Khả năng chịu lực nén và độ hút nước của gạch ECOVAL Gen3 như thế nào?",
        "expected_keywords": ["7.8", "8.2", "MPa", "1.2%"]
    },
    {
        "id": 3,
        "category": "Pricing & Quantity",
        "question": "Giá bán dự kiến một viên gạch ECOVAL là bao nhiêu và thi công 1m2 cần bao nhiêu viên?",
        "expected_keywords": ["45.000", "25"]
    },
    {
        "id": 4,
        "category": "EPR Savings",
        "question": "Doanh nghiệp tôi xả 5.000 kg rác nhựa MLP mỗi năm thì tiết kiệm được bao nhiêu tiền phí EPR?",
        "expected_keywords": ["40%", "30.000.000"]
    },
    {
        "id": 5,
        "category": "Durability & Warranty",
        "question": "Gạch bông gió ECOVAL có chịu được ánh nắng mặt trời và mưa gió ngoài trời không?",
        "expected_keywords": ["10 năm", "UV", "SGS"]
    },
    {
        "id": 6,
        "category": "Partnership & Supply",
        "question": "Làm sao để vựa ve chai hoặc cá nhân đăng ký cung ứng nguyên liệu nhựa MLP cho ECOVAL?",
        "expected_keywords": ["đăng ký", "thu gom", "MLP"]
    },
    {
        "id": 7,
        "category": "Thermal & Energy",
        "question": "Thiết kế hoa văn di sản của gạch ECOVAL giúp giảm bao nhiêu độ C nhiệt độ phòng?",
        "expected_keywords": ["3-4°C", "thông gió"]
    },
    {
        "id": 8,
        "category": "ESG & CO2 Impact (EN)",
        "question": "How much plastic waste is upcycled and CO2 reduced per ECOVAL brick?",
        "expected_keywords": ["1.05 kg", "1.50 kg", "CO2"]
    },
    {
        "id": 9,
        "category": "Dimensions & CAD",
        "question": "Kích thước chuẩn của gạch bông gió ECOVAL là bao nhiêu cm?",
        "expected_keywords": ["19", "19", "6.5"]
    },
    {
        "id": 10,
        "category": "Company & R&D Lab",
        "question": "Phòng nghiên cứu R&D và đối tác kiểm định thực tế của ECOVAL ở đâu?",
        "expected_keywords": ["Bách Khoa", "Ánh Thủy"]
    }
]

# DeepSeek-V3 Official API Pricing (USD / 1M Tokens)
INPUT_PRICE_PER_1M = 0.14   # $0.14 per 1M input tokens
OUTPUT_PRICE_PER_1M = 0.28  # $0.28 per 1M output tokens
USD_TO_VND = 25400.0


def run_benchmark():
    print("\n=========================================================================")
    print("  RUNNING ECOVAL DEEPSEEK API RAG BENCHMARK SUITE (10 SCENARIOS)")
    print("=========================================================================\n")

    results: List[Dict] = []
    total_input_tokens = 0
    total_output_tokens = 0
    total_latency_sec = 0.0

    for q in BENCHMARK_QUESTIONS:
        qid = q["id"]
        category = q["category"]
        question = q["question"]
        expected = q["expected_keywords"]

        print(f"[{qid}/10] Testing Category: {category}...")
        print(f"    Q: \"{question}\"")

        start_time = time.perf_counter()
        ttft = None
        first_token_time = None
        full_answer = []

        # Run streaming query to capture TTFT
        for sse_line in ask_stream(question):
            if sse_line.startswith("data: "):
                try:
                    payload = json.loads(sse_line.replace("data: ", "").strip())
                    if payload.get("type") == "token":
                        if first_token_time is None:
                            first_token_time = time.perf_counter()
                            ttft = first_token_time - start_time
                        full_answer.append(payload.get("token", ""))
                except Exception:
                    pass

        end_time = time.perf_counter()
        total_time = end_time - start_time
        answer_text = "".join(full_answer).strip()

        # Check accuracy keywords
        matched = [kw for kw in expected if kw.lower() in answer_text.lower()]
        accuracy_pct = (len(matched) / len(expected)) * 100.0 if expected else 100.0

        # Estimate tokens (approx 1 word = 1.3 tokens in Vietnamese/English mix)
        est_input_tokens = len(question.split()) * 2 + 650  # ~650 tokens system prompt + RAG context
        est_output_tokens = len(answer_text.split()) * 2

        query_cost_usd = (est_input_tokens * INPUT_PRICE_PER_1M / 1_000_000) + (est_output_tokens * OUTPUT_PRICE_PER_1M / 1_000_000)
        query_cost_vnd = query_cost_usd * USD_TO_VND

        total_input_tokens += est_input_tokens
        total_output_tokens += est_output_tokens
        total_latency_sec += total_time

        result_item = {
            "id": qid,
            "category": category,
            "ttft_sec": round(ttft or total_time, 3),
            "total_time_sec": round(total_time, 3),
            "input_tokens": est_input_tokens,
            "output_tokens": est_output_tokens,
            "cost_usd": query_cost_usd,
            "cost_vnd": query_cost_vnd,
            "accuracy_pct": round(accuracy_pct, 1),
            "snippet": answer_text[:120].replace("\n", " ") + "..."
        }
        results.append(result_item)

        print(f"    -> TTFT: {result_item['ttft_sec']}s | Total: {result_item['total_time_sec']}s | Accuracy: {result_item['accuracy_pct']}% | Cost: ${result_item['cost_usd']:.6f} (~{result_item['cost_vnd']:.2f} VND)")
        print(f"    Ans: {result_item['snippet']}\n")

    # Print summary report
    total_cost_usd = sum(r["cost_usd"] for r in results)
    total_cost_vnd = sum(r["cost_vnd"] for r in results)
    avg_ttft = sum(r["ttft_sec"] for r in results) / len(results)
    avg_latency = total_latency_sec / len(results)
    avg_accuracy = sum(r["accuracy_pct"] for r in results) / len(results)

    print("\n=========================================================================")
    print("  ECOVAL DEEPSEEK API BENCHMARK FINAL SUMMARY REPORT")
    print("=========================================================================")
    print(f"* Total Queries Processed:     {len(results)}")
    print(f"* Average Time to First Token: {avg_ttft:.3f} seconds")
    print(f"* Average Total Latency:       {avg_latency:.3f} seconds")
    print(f"* Average Keyword Accuracy:    {avg_accuracy:.1f}%")
    print(f"* Total Input Tokens Used:     {total_input_tokens:,}")
    print(f"* Total Output Tokens Used:    {total_output_tokens:,}")
    print(f"* Total Suite Execution Cost:  ${total_cost_usd:.6f} USD (~{total_cost_vnd:.2f} VND)")
    print(f"* Projected Cost / 1,000 Qs:   ${total_cost_usd * 100:.2f} USD (~{total_cost_vnd * 100:,.0f} VND)")
    print("=========================================================================\n")


if __name__ == "__main__":
    run_benchmark()
