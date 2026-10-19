import sqlite3
import json

DB_NAME = "results.db"

def init():
    with sqlite3.connect(DB_NAME) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prompt TEXT NOT NULL,
                timestamp REAL NOT NULL,
                datetime TEXT NOT NULL,
                supervised INTEGER NOT NULL,
                f_length INTEGER NOT NULL,
                f_emoji_count INTEGER NOT NULL,
                f_word_count INTEGER NOT NULL,
                f_number_count INTEGER NOT NULL,
                f_punctuation_count INTEGER NOT NULL,
                f_exclamation_count INTEGER NOT NULL,
                f_question_count INTEGER NOT NULL,
                f_special_character_count INTEGER NOT NULL,
                f_attack_phrase_count INTEGER NOT NULL,
                f_override_phrase_count INTEGER NOT NULL,
                f_suspicious_action_count INTEGER NOT NULL,
                f_sensitive_target_count INTEGER NOT NULL,
                f_entropy REAL NOT NULL,
                binary_clustering INTEGER NOT NULL,
                attack_type TEXT NOT NULL,
                attack_type_distance REAL NOT NULL
            )
        """)

def add_result(result):
    with sqlite3.connect(DB_NAME) as conn:
        conn.execute("""
            INSERT INTO results (prompt, timestamp, datetime, 
                supervised, f_length, f_emoji_count, f_word_count, f_number_count, 
                    f_punctuation_count, f_exclamation_count, f_question_count,
                    f_special_character_count, f_attack_phrase_count,
                    f_override_phrase_count, f_suspicious_action_count,
                    f_sensitive_target_count, f_entropy,
                binary_clustering, 
                attack_type, attack_type_distance)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                result['prompt'],
                result['timestamp'],
                result['datetime'],
                result['supervised']['label'],
                result['supervised']['features']['length'],
                result['supervised']['features']['emoji_count'],
                result['supervised']['features']['word_count'],
                result['supervised']['features']['number_count'],
                result['supervised']['features']['punctuation_count'],
                result['supervised']['features']['exclamation_count'],
                result['supervised']['features']['question_count'],
                result['supervised']['features']['special_character_count'],
                result['supervised']['features']['attack_phrase_count'],
                result['supervised']['features']['override_phrase_count'],
                result['supervised']['features']['suspicious_action_count'],
                result['supervised']['features']['sensitive_target_count'],
                result['supervised']['features']['entropy'],
                result['binary_clustering'],
                result['attack_type']['label'],
                result['attack_type']['distance']
            )
        )

def get_results():
    with sqlite3.connect(DB_NAME) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            "SELECT * FROM results ORDER BY id"
        ).fetchall()

    return {
        row["id"]: {
            "prompt": row["prompt"],
            "timestamp": row["timestamp"],
            "datetime": row["datetime"],
            "supervised": {
                "label": bool(row["supervised"]),
                "features": {
                    "length": row["f_length"],
                    "emoji_count": row["f_emoji_count"],
                    "word_count": row["f_word_count"],
                    "number_count": row["f_number_count"],
                    "punctuation_count": row["f_punctuation_count"],
                    "exclamation_count": row["f_exclamation_count"],
                    "question_count": row["f_question_count"],
                    "special_character_count": row["f_special_character_count"],
                    "attack_phrase_count": row["f_attack_phrase_count"],
                    "override_phrase_count": row["f_override_phrase_count"],
                    "suspicious_action_count": row["f_suspicious_action_count"],
                    "sensitive_target_count": row["f_sensitive_target_count"],
                    "entropy": row["f_entropy"],
                }
            },
            "binary_clustering": bool(row["binary_clustering"]),
            "attack_type": {
                "label": row["attack_type"],
                "distance": row["attack_type_distance"]
            }
        }
        for row in rows
    }


def get_result(id):
    with sqlite3.connect(DB_NAME) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            "SELECT * FROM results WHERE id = ?",
            (id,)
        ).fetchone()

    if row is None:
        raise KeyError(id)

    return {
        "prompt": row["prompt"],
        "timestamp": row["timestamp"],
        "datetime": row["datetime"],
        "supervised": {
            "label": bool(row["supervised"]),
            "features": {
                "length": row["f_length"],
                "emoji_count": row["f_emoji_count"],
                "word_count": row["f_word_count"],
                "number_count": row["f_number_count"],
                "punctuation_count": row["f_punctuation_count"],
                "exclamation_count": row["f_exclamation_count"],
                "question_count": row["f_question_count"],
                "special_character_count": row["f_special_character_count"],
                "attack_phrase_count": row["f_attack_phrase_count"],
                "override_phrase_count": row["f_override_phrase_count"],
                "suspicious_action_count": row["f_suspicious_action_count"],
                "sensitive_target_count": row["f_sensitive_target_count"],
                "entropy": row["f_entropy"],
            }
        },
        "binary_clustering": bool(row["binary_clustering"]),
        "attack_type": {
            "label": row["attack_type"],
            "distance": row["attack_type_distance"]
        }
    }

def delete_result(id):
    with sqlite3.connect(DB_NAME) as conn:
        conn.execute(
            "DELETE FROM results WHERE id = ?",
            (id,)
        )


def get_latest_result_id():
    with sqlite3.connect(DB_NAME) as conn:
        row = conn.execute("""
            SELECT id
            FROM results
            ORDER BY timestamp DESC, id DESC
            LIMIT 1
        """).fetchone()

    return row[0]
