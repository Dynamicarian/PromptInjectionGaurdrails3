import pandas as pd 
from sklearn.model_selection import train_test_split
from sub_models.svm_predict import model, FEATURE_COLUMNS
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)


df = pd.read_csv('./data/data.csv')


X = df[FEATURE_COLUMNS]
y = df["label"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=0
)

def get_data_report():
    return {
        "total": int(len(df)),
        "benign_prompt": int((df["label"] == 0).sum()), 
        "malicious_prompt": int((df["label"] == 1).sum()), 
    }

def confusion_metrics():
    y_pred = model.predict(X_test)

    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()

    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1": float(f1_score(y_test, y_pred)),
        "tn": int(tn),
        "fp": int(fp),
        "fn": int(fn),
        "tp": int(tp),
    }


def threshold_metrics(steps=100):
    scores = model.decision_function(X_test)
    y_true = np.asarray(y_test)
    thresholds = np.linspace(scores.min(), scores.max(), steps)

    rows = []
    for t in thresholds:
        pred = (scores >= t).astype(int)
        tp = int(((pred == 1) & (y_true == 1)).sum())
        fp = int(((pred == 1) & (y_true == 0)).sum())
        fn = int(((pred == 0) & (y_true == 1)).sum())
        tn = int(((pred == 0) & (y_true == 0)).sum())
        rows.append({
            "threshold": round(float(t), 3),
            "precision": round(float(precision_score(y_true, pred, zero_division=0)), 3),
            "recall": round(float(recall_score(y_true, pred, zero_division=0)), 3),
            "f1": round(float(f1_score(y_true, pred, zero_division=0)), 3),
            "tp": tp, "fp": fp, "fn": fn, "tn": tn,
        })
    return rows