import csv
import json
from pathlib import Path

# Folder containing the benchmark CSV file
FOLDER = Path(__file__).resolve().parent

# Location to export the JSON file for React
OUTPUT = FOLDER.parent.parent / "frontend" / "src" / "data" / "normalizationBenchmark.json"

results = []

# Read the performance benchmark CSV file
with open(FOLDER / "normalization_benchmark.csv", encoding="utf-8", newline="") as file:
    for row in csv.DictReader(file):
        # Convert CSV values into the correct data types
        results.append({
            "variant": row["variant"],
            "sample": int(row["sample"]),
            "without_nfkc": float(row["without_nfkc"]),
            "with_nfkc": float(row["with_nfkc"]),
            "overhead": float(row["overhead"])
        })

# Create the output folder if it does not exist
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

# Export the results as JSON
with open(OUTPUT, "w", encoding="utf-8") as file:
    json.dump(results, file, indent=2)

print(f"Exported {len(results)} benchmark records to {OUTPUT}")




