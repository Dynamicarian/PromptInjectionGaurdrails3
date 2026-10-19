from fastembed import TextEmbedding
import joblib
import numpy as np
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "sub_models" / "attack_type_kmeans.joblib"
bundle = joblib.load(MODEL_PATH)
kmeans = bundle["kmeans"]
cluster_to_label = bundle["cluster_to_label"]

embedding_model = TextEmbedding()


def predict_attack_type(prompt: str) -> dict:
    normalised_prompt = normalize_prompt(prompt)
    embedding = np.asarray(list(embedding_model.embed(normalised_prompt)), dtype=float).reshape(1, -1)

    #all clusters
    dists = kmeans.transform(embedding)[0]
    # predicted cluster
    predicted_cluster = int(dists.argmin())

    label_percentages = {}
    for cluster, dist in enumerate(dists):
        label = cluster_to_label[cluster]
        current_dist = label_percentages.get(label)
        if (current_dist is None) or dist < label_percentages[label]:
            label_percentages[label] = dist

    total = 0
    for dist in label_percentages.values():
        total += dist

    for cluster in label_percentages.keys():
        label_percentages[cluster] /= total

    return {
        "label": cluster_to_label[predicted_cluster],
        "percentages": label_percentages,
    }

def normalize_prompt(prompt):
    prompt = prompt.lower()
    prompt = re.sub(r"\s+", " ", prompt)
    return prompt.strip()

if __name__ == "__main__":
    print(cluster_to_label)