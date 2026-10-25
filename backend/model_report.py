import pandas as pd 
from sklearn.model_selection import train_test_split
from sub_models.svm_predict import predict_supervised
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)

df = pd.read_csv('./data/data.csv')
feature_columns = [
    "length",
    "emoji_count",
    "word_count",
    "number_count",
    "punctuation_count",
    "exclamation_count",
    "question_count",
    "special_character_count",
    "attack_phrase_count",
    "override_phrase_count",
    "suspicious_action_count",
    "sensitive_target_count",
    "entropy",
]

X = df[feature_columns]
y = df["label"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=0
)

def confusion_metrics():
    y_pred = predict_supervised(X_train)

    # evaluate final model
    accuracy = accuracy_score(y_test, y_pred)

    precision = precision_score(y_test, y_pred)

    recall = recall_score(y_test, y_pred)

    f1 = f1_score(y_test, y_pred)
    return{
        "accuracy": int(accuracy), 
        "precision": int(precision), 
        "recall": int(recall), 
        "f1": int(f1)
    }
