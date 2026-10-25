import { useState } from "react";
import Pagination from "../../results/components/Pagination.jsx";

export default function SecurityPromptTable({ records }) {
    // States for filtering and pagination
    const [labelFilter, setLabelFilter] = useState("All");
    const [variantFilter, setVariantFilter] = useState("All");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);



    // Filter prompts based on the selected label and variant
    const filtered = records.filter((record) => {
        const matchLabel =
            labelFilter === "All" ||
            record.actualLabel === labelFilter;

        const matchVariant =
            variantFilter === "All" ||
            record.variant === variantFilter;

        return matchLabel && matchVariant;
    });

    // Calculate which prompts should appear on the current page
    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / pageSize)
    );

    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const visibleRecords = filtered.slice(
        start,
        start + pageSize
    );

    // Convert Boolean predictions into readable labels
    const predictionText = (blocked) =>
        blocked ? "Blocked" : "Allowed";

    // Determine whether the prediction matches the actual label
    const isCorrect = (record, blocked) =>
        blocked === (record.actualLabel === "Malicious");

    return (
        <section className="security-prompt-section">

            <h2>Prompt Comparison</h2>
            <p>
                View the tested prompts and compare their
                classification results before and after NFKC.
            </p>
            {/* Filters */}
            <div className="security-prompt-filters">

                <select
                    value={labelFilter}
                    aria-label="Filter by actual label"
                    onChange={(e) => {
                        setLabelFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="All">All Labels</option>
                    <option value="Malicious">Malicious</option>
                    <option value="Benign">Benign</option>
                </select>

                <select
                    value={variantFilter}
                    aria-label="Filter by prompt variant"
                    onChange={(e) => {
                        setVariantFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="All">All Variants</option>
                    <option value="Original">Original</option>
                    <option value="Fullwidth">Fullwidth</option>
                </select>

            </div>

            <p className="security-prompt-count">
                Showing {visibleRecords.length} of {filtered.length} records
            </p>

            {/* Prompt comparison table */}
            <div className="security-prompt-table-wrapper">

                <table className="security-prompt-table">
                    <thead>
                        <tr>
                            <th scope="col">Prompt</th>
                            <th scope="col">Actual Label</th>
                            <th scope="col">Variant</th>
                            <th scope="col">Before NFKC</th>
                            <th scope="col">After NFKC</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleRecords.map((record) => (
                            <tr key={record.id}>
                                <td className="security-prompt-text">
                                    {record.prompt}
                                </td>
                                
                                {/* Actual label with colour */}
                                <td>
                                    <span
                                        className={
                                            record.actualLabel === "Malicious"
                                                ? "security-label-malicious"
                                                : "security-label-benign"
                                        }
                                    >
                                        {record.actualLabel}
                                    </span>
                                </td>

                                {/* Prompt variant */}
                                <td>
                                    {record.variant}
                                </td>

                                {/* Predictions displayed as plain text */}
                                <td>
                                    {predictionText(record.beforeBlocked)}
                                </td>

                                <td>
                                    {predictionText(record.afterBlocked)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={currentPage}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={(size) => {
                    setPageSize(Number(size));
                    setPage(1);
                }}
                total={filtered.length}
            />

        </section>
    );
}
