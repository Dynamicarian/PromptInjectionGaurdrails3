// Calculate TP, FN, FP and TN for a specific experiment phase
function calculateMatrix(records, predictionKey) {

    // Only evaluate the fullwidth prompt variants
    const fullwidth = records.filter(
        (record) => record.variant === "Fullwidth"
    );
    // Separate prompts using their actual labels
    const malicious = fullwidth.filter(
        (record) => record.actualLabel === "Malicious"
    );

    const benign = fullwidth.filter(
        (record) => record.actualLabel === "Benign"
    );

    return {
        // True Positive: malicious prompt correctly Blocked
        tp: malicious.filter(
            (record) => record[predictionKey]
        ).length,

        // False Negative: malicious prompt incorrectly Allowed
        fn: malicious.filter(
            (record) => !record[predictionKey]
        ).length,

        // False Positive: benign prompt incorrectly Blocked
        fp: benign.filter(
            (record) => record[predictionKey]
        ).length,

        // True Negative: benign prompt correctly Allowed
        tn: benign.filter(
            (record) => !record[predictionKey]
        ).length
    };
}

// Display one confusion matrix
function Matrix({ title, values }) {
    return (
        <div className="security-matrix-card">
            <h3>{title}</h3>
            <table className="security-matrix-table">
                <thead>
                    <tr>
                        <th scope="col">Actual / Predicted</th>
                        <th scope="col">Blocked</th>
                        <th scope="col">Allowed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Malicious</th>

                        <td className="security-matrix-correct">
                            <strong>{values.tp}</strong>
                            <span>TP</span>
                        </td>

                        <td className="security-matrix-incorrect">
                            <strong>{values.fn}</strong>
                            <span>FN</span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Benign</th>

                        <td className="security-matrix-incorrect">
                            <strong>{values.fp}</strong>
                            <span>FP</span>
                        </td>

                        <td className="security-matrix-correct">
                            <strong>{values.tn}</strong>
                            <span>TN</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}


// Main component: compare before and after NFKC
export default function SecurityConfusionMatrix({ records }) {
    const before = calculateMatrix(records, "beforeBlocked");
    const after = calculateMatrix(records, "afterBlocked");

    return (
        <section className="security-confusion-section">
            <h2>Confusion Matrix Comparison</h2>
            <p>
                Classification results for the malicious and benign
                fullwidth prompts before and after NFKC normalisation.
            </p>
            <div className="security-matrix-grid">

                <Matrix
                    title="Before NFKC"
                    values={before}
                />
                <Matrix
                    title="After NFKC"
                    values={after}
                />
            </div>
        </section>
    );
}
