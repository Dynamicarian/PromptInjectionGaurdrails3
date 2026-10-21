const PHRASES = [
    // Attack phrases
    "ignore previous instructions",
    "ignore all previous instructions",
    "disregard the above",
    "you are now",
    "system prompt",
    "act as",
    "jailbreak",
    "do anything now",
    "new instructions",

    // Override phrases
    "ignore",
    "disregard",
    "bypass",
    "override",
    "forget",
    "ignore limits",
    "ignore restrictions",
    "ignore rules",

    // Suspicious actions
    "reveal",
    "show",
    "dump",
    "share",
    "extract",
    "execute",
    "access",
    "display",
    "run",
    "eval",
    "bash",
    "shell",
    "decode",
    "base64",
    "encoded",
    "hexadecimal",
    "rot13",

    // Sensitive targets
    "password",
    "passwords",
    "api key",
    "api keys",
    "training data",
    "source code",
    "system prompt",
    "model weights",
    "session cookies",
    "user sessions",
    "memory contents",
    "internal logs",
    "system logs"
];

export function findSuspiciousSpans(prompt) {
    const text = prompt.toLowerCase();
    const matches = [];

    for (const phrase of PHRASES) {
        let position = 0;

        while (true) {
            const start = text.indexOf(phrase, position);

            if (start === -1) break;

            matches.push({
                start,
                end: start + phrase.length
            });

            position = start + phrase.length;
        }
    }

    // Sort matched phrases by their position
    matches.sort((a, b) => a.start - b.start);

    // Merge overlapping matches to avoid nested highlights
    const spans = [];

    for (const match of matches) {
        const previous = spans[spans.length - 1];

        if (previous && match.start <= previous.end) {
            previous.end = Math.max(previous.end, match.end);
        } else {
            spans.push({ ...match });
        }
    }

    return spans;
}
