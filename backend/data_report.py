import pandas as pd
from fastapi import FastAPI


def get_data_report():
    df = pd.read_csv('./data/data.csv')
    return {
        "total": int(len(df)),
        "benign_prompt": int((df["label"] == 0).sum()), 
        "malicious_prompt": int((df["label"] == 1).sum()), 
    }