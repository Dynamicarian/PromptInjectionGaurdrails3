import csv
import time
import statistics
from pathlib import Path
from unicode_normalization import normalize_prompt

FOLDER = Path(__file__).resolve().parent
SAMPLES = 200
REPEATS = 20


# Return the prompt without normalisation
def without_nfkc(prompt):
    return prompt




# Measure the average processing time per prompt (microseconds)
def measure(prompts, function):
    start = time.perf_counter_ns()
    # Process all prompts 20 times
    for _ in range(REPEATS):
        for prompt in prompts:
            function(prompt)
    end = time.perf_counter_ns()
    total = len(prompts) * REPEATS
    return (end - start) / total / 1000


# Load all original and fullwidth prompts
original = []
fullwidth = []
# Take malicious and benign prompts to undergo the benchmark test
for filename in ["evasion_baseline.csv", "benign_before_nfkc.csv"]:
    with open(FOLDER / filename, encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            original.append(row["original_prompt"])
            fullwidth.append(row["obfuscated_prompt"])

results = []
# Benchmark original and fullwidth prompts separately
for variant, prompts in [("Original", original), ("Fullwidth", fullwidth)]:
    print(f"\n--- {variant} Prompts ({len(prompts)}) ---")
    # # Warm up both functions before recording results
    # for _ in range(10):
    #     measure(prompts, without_nfkc)
    #     measure(prompts, normalize_prompt)

    # Collect 200 timing samples
    for sample in range(1, SAMPLES + 1):
        before = measure(prompts, without_nfkc)
        after = measure(prompts, normalize_prompt)

        results.append({
            "variant": variant,
            "sample": sample,
            "without_nfkc": before,
            "with_nfkc": after,
            "overhead": after - before
        })

    # Get the 200 measurements for this variant
    rows = [r for r in results if r["variant"] == variant]
    before_times = [r["without_nfkc"] for r in rows]
    after_times = [r["with_nfkc"] for r in rows]
    overhead_times = [r["overhead"] for r in rows]

    # Calculate P95 using the sorted measurements
    # Sort from smallest to biggest
    # Find 95% percentile (just like median take 50%)
    p95 = sorted(after_times)[int(SAMPLES * 0.95) - 1]

    # Display summary statistics
    print(f"Without NFKC average: {statistics.mean(before_times):.4f} µs")
    print(f"With NFKC average: {statistics.mean(after_times):.4f} µs")
    print(f"With NFKC median: {statistics.median(after_times):.4f} µs")
    print(f"With NFKC P95: {p95:.4f} µs")
    print(f"Average overhead: {statistics.mean(overhead_times):.4f} µs")


# Export all 400 timing samples to CSV
output = FOLDER / "normalization_benchmark.csv"
with open(output, "w", encoding="utf-8", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=results[0].keys())
    writer.writeheader()
    writer.writerows(results)

print(f"\nResults saved to: {output}")