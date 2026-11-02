
import unicodedata

# Common Cyrillic characters that resemble Latin letters
# Source: Textria Cyrillic-Latin Confusables reference
CONFUSABLES = str.maketrans({

    #https://textria.ru/en/reference/cyrillic-latin-confusables/
    # Uppercase Cyrillic
    "А": "A",
    "В": "B",
    "Е": "E",
    "К": "K",
    "М": "M",
    "Н": "H",
    "О": "O",
    "Р": "P",
    "С": "C",
    "Т": "T",
    "Х": "X",

    # Lowercase Cyrillic
    "а": "a",
    "е": "e",
    "о": "o",
    "р": "p",
    "с": "c",
    "у": "y",
    "х": "x",

    # Additional Cyrillic characters
    "І": "I",
    "і": "i",
    "Ј": "J",
    "ј": "j",
    "Ѕ": "S",
    "ѕ": "s",
})


def normalize_prompt(prompt: str) -> str:
    # Convert fullwidth Unicode characters using NFKC
    normalized = unicodedata.normalize("NFKC", prompt)
    # Replace selected Cyrillic look-alike characters
    normalized = normalized.translate(CONFUSABLES)

    return normalized
