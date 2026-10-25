import csv
import json
from pathlib import Path

# Folder containing the four experiment CSV files
FOLDER = Path(__file__).resolve().parent
# Location where React will read the exported JSON file
OUTPUT = FOLDER.parent.parent / "frontend" / "src" / "data" / "securityResults.json"

# https://docs.python.org/3/library/csv.html
# Read CSV file and convert its rows into dictionaries
def read_csv(filename):
    with open(FOLDER / filename, encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


# Each group contains the actual label and the before/after CSV filenames
experiments = [
    ("Malicious", "evasion_baseline.csv", "evasion_baseline_nfkc.csv"),
    ("Benign", "benign_before_nfkc.csv", "benign_after_nfkc.csv"),
]

results = []

# Process malicious and benign experiment files
# We use tuple to determine the experiment filess
for label, before_file, after_file in experiments:

    before = read_csv(before_file)
    after = read_csv(after_file)

    # Make sure both files have the same number of tests
    if len(before) != len(after):
        raise ValueError("Different number of tests")
    # zip() pairs each before-NFKC test with its after-NFKC test
    for old, new in zip(before, after):
        # Check that both rows belong to the same test
        if old["test_id"] != new["test_id"]:
            raise ValueError("Test IDs do not match")

        # Each test contains an original and a fullwidth prompt
        for variant, prompt_column, result_column in [
            ("Original", "original_prompt", "original_blocked"),
            ("Fullwidth", "obfuscated_prompt", "obfuscated_blocked"),
        ]:

            # Ensure the prompt text is the same in both experiments
            if old[prompt_column] != new[prompt_column]:
                raise ValueError("Prompt text does not match")

            # Store the prompt and its predictions in one dictionary
            results.append(
                {
                    "id": f"{label}-{old['test_id']}-{variant}",
                    "prompt": old[prompt_column],
                    "actualLabel": label,
                    "variant": variant,
                    "beforeBlocked": old[result_column].strip().lower() == "true",
                    "afterBlocked": new[result_column].strip().lower() == "true",
                }
            )


# Create the output folder if it does not exist
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

# Export all combined results as JSON for the React frontend
with open(OUTPUT, "w", encoding="utf-8") as file:
    json.dump(results, file, indent=2, ensure_ascii=False)

print(f"Exported done")
