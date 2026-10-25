export default function SecuritySummary({ records }) {

    // Select only fullwidth prompts for our NFKC defence evaluation
    const fullwidth = records.filter(
        (record) => record.variant === "Fullwidth"
    );
    // Separate malicious and benign prompts
    const malicious = fullwidth.filter(
        (record) => record.actualLabel === "Malicious"
    );
    const benign = fullwidth.filter(
        (record) => record.actualLabel === "Benign"
    );

    // False Negative: malicious prompt incorrectly classified as Allowed
    const fnBefore = malicious.filter(
        (record) => !record.beforeBlocked
    ).length;
    const fnAfter = malicious.filter(
        (record) => !record.afterBlocked
    ).length;

    // False Positive: benign prompt incorrectly classified as Blocked
    const fpBefore = benign.filter(
        (record) => record.beforeBlocked
    ).length;
    const fpAfter = benign.filter(
        (record) => record.afterBlocked
    ).length;

    // Convert a count into a percentage (two decimals)
    const percentage = (count, total) =>
        total === 0 ? "N/A" : ((count / total) * 100).toFixed(2) + "%";

    // Prepare the information displayed in each summary card
    const summary = [
        {
            title: "Evasion Rate Before NFKC",
            value: percentage(fnBefore, malicious.length),
            count: `${fnBefore} / ${malicious.length} malicious prompts allowed`
        },
        {
            title: "Evasion Rate After NFKC",
            value: percentage(fnAfter, malicious.length),
            count: `${fnAfter} / ${malicious.length} malicious prompts allowed`
        },
        {
            title: "False Positive Rate Before",
            value: percentage(fpBefore, benign.length),
            count: `${fpBefore} / ${benign.length} benign prompts blocked`
        },
        {
            title: "False Positive Rate After",
            value: percentage(fpAfter, benign.length),
            count: `${fpAfter} / ${benign.length} benign prompts blocked`
        }
    ];

    return (
        <section className="security-summary">
            <h2>Security Summary</h2>

            <p>
                Comparison of fullwidth Unicode prompt detection before and after NFKC normalisation.
            </p>

            <div className="security-summary-grid">
                {summary.map((item) => (
                    <div className="security-summary-card" key={item.title}>
                        <h3>{item.title}</h3>

                        <p className="security-summary-value">
                            {item.value}
                        </p>

                        <span>{item.count}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
