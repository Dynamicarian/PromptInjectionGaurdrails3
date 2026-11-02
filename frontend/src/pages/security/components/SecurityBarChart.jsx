import { useState, useId } from "react";

// SVG dimensions and margins
const W = 560;
const H = 300;
const M = { top: 35, right: 20, bottom: 55, left: 50 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

// Draw a bar with rounded top corners
function barPath(x, y, width, height) {
    const r = Math.min(4, height, width / 2);

    return `M${x},${y + height}
            V${y + r}
            Q${x},${y} ${x + r},${y}
            H${x + width - r}
            Q${x + width},${y} ${x + width},${y + r}
            V${y + height} Z`;
}

export default function SecurityBarChart({ records }) {

    const [hovered, setHovered] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const tableId = useId();
    // Only evaluate fullwidth prompts
    const fullwidth = records.filter(
        (record) => record.variant === "Fullwidth"
    );
    const malicious = fullwidth.filter(
        (record) => record.actualLabel === "Malicious"
    );
    const benign = fullwidth.filter(
        (record) => record.actualLabel === "Benign"
    );

    // Calculate false negatives and false positives
    const fnBefore = malicious.filter(r => !r.beforeBlocked).length;
    const fnAfter = malicious.filter(r => !r.afterBlocked).length;

    const fpBefore = benign.filter(r => r.beforeBlocked).length;
    const fpAfter = benign.filter(r => r.afterBlocked).length;

    // Convert counts into percentages
    const rate = (count, total) =>
        total === 0 ? 0 : (count / total) * 100;

    // Data for the two groups in our chart
    const data = [
        {
            label: "False Negative Rate",
            name: "False Negative Rate",
            values: [
                {
                    phase: "Before NFKC",
                    count: fnBefore,
                    total: malicious.length,
                    value: rate(fnBefore, malicious.length)
                },
                {
                    phase: "After NFKC",
                    count: fnAfter,
                    total: malicious.length,
                    value: rate(fnAfter, malicious.length)
                }
            ]
        },
        {
            label: "False Positive Rate",
            name: "False Positive Rate",
            values: [
                {
                    phase: "Before NFKC",
                    count: fpBefore,
                    total: benign.length,
                    value: rate(fpBefore, benign.length)
                },
                {
                    phase: "After NFKC",
                    count: fpAfter,
                    total: benign.length,
                    value: rate(fpAfter, benign.length)
                }
            ]
        }
    ];

    // Calculate the Y-axis scale automatically
    const maxValue = Math.max(
        Math.ceil(
            Math.max(...data.flatMap(d => d.values.map(v => v.value))) / 10
        ) * 10
    );

    // Convert percentages to Y coordinates
    const y = (value) =>
        M.top + PLOT_H - (value / maxValue) * PLOT_H;

    const groupWidth = PLOT_W / data.length;
    const barWidth = 50;
    const gap = 12;

    // Y-axis labels: 0, 10, 20, 30, ...
    const ticks = Array.from(
        { length: maxValue / 10 + 1 },
        (_, i) => i * 10
    );

    // Find the currently hovered bar
    const active = hovered === null
        ? null
        : data[hovered.group].values[hovered.bar];

    return (
        <section className="security-chart-section">

            <h2>Detection Performance Comparison</h2>

            <p>
                False negative and false positive rates
                before and after NFKC normalisation.
            </p>

            <figure className="security-chart-figure">

                <div className="security-chart-legend">
                    <span>
                        <i className="security-legend-before" />
                        Before NFKC
                    </span>

                    <span>
                        <i className="security-legend-after" />
                        After NFKC
                    </span>
                </div>

                <div className="security-chart">

                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        role="img"
                        aria-label="Grouped bar chart comparing false negative and false positive rates before and after NFKC"
                    >

                        {/* Horizontal gridlines and Y-axis labels */}
                        {ticks.map((tick) => (
                            <g key={tick}>
                                <line
                                    className="security-chart-gridline"
                                    x1={M.left}
                                    x2={W - M.right}
                                    y1={y(tick)}
                                    y2={y(tick)}
                                />

                                <text
                                    className="security-chart-axis-label"
                                    x={M.left - 10}
                                    y={y(tick)}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                >
                                    {tick}%
                                </text>
                            </g>
                        ))}

                        {/* Create one group for FNR and one for FPR */}
                        {data.map((metric, i) => {

                            // Centre of this metric's group
                            const center =
                                M.left + groupWidth * (i + 0.5);

                            return (
                                <g key={metric.label}>

                                    {/* Two bars per group: Before and After */}
                                    {metric.values.map((item, j) => {

                                        const x = center
                                            - barWidth
                                            - gap / 2
                                            + j * (barWidth + gap);

                                        const barHeight = y(0) - y(item.value);

                                        const isDimmed =
                                            hovered !== null &&
                                            (hovered.group !== i ||
                                                hovered.bar !== j);

                                        return (
                                            <g
                                                key={item.phase}
                                                onPointerEnter={() =>
                                                    setHovered({ group: i, bar: j })
                                                }
                                                onPointerLeave={() =>
                                                    setHovered(null)
                                                }
                                            >
                                                {/* Invisible hover area */}
                                                <rect
                                                    x={x - 4}
                                                    y={M.top}
                                                    width={barWidth + 8}
                                                    height={PLOT_H}
                                                    fill="transparent"
                                                />

                                                {/* Actual SVG bar */}
                                                <path
                                                    d={barPath(
                                                        x,
                                                        y(item.value),
                                                        barWidth,
                                                        barHeight
                                                    )}
                                                    className={
                                                        j === 0
                                                            ? "security-bar-before"
                                                            : "security-bar-after"
                                                    }
                                                    opacity={isDimmed ? 0.4 : 1}
                                                />

                                                {/* Percentage above the bar */}
                                                <text
                                                    className="security-chart-value"
                                                    x={x + barWidth / 2}
                                                    y={y(item.value) - 8}
                                                    textAnchor="middle"
                                                >
                                                    {item.value.toFixed(1)}%
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* FNR or FPR on the X-axis */}
                                    <text
                                        className="security-chart-axis-label"
                                        x={center}
                                        y={H - M.bottom + 25}
                                        textAnchor="middle"
                                    >
                                        {metric.label}
                                    </text>

                                </g>
                            );
                        })}

                        {/* X-axis baseline */}
                        <line
                            className="security-chart-axis"
                            x1={M.left}
                            x2={W - M.right}
                            y1={y(0)}
                            y2={y(0)}
                        />

                    </svg>

                    {/* Display more information when hovering */}
                    {active && (
                        <div className="security-chart-tooltip">
                            <strong>{active.phase}</strong>
                            <span>{active.value.toFixed(1)}%</span>
                            <span>
                                {active.count} / {active.total} prompts
                            </span>
                        </div>
                    )}

                </div>

                {/* Accessible data table */}
                <button
                    type="button"
                    className="security-table-toggle"
                    aria-expanded={showTable}
                    aria-controls={tableId}
                    onClick={() => setShowTable(!showTable)}
                >
                    {showTable ? "Hide Data Table" : "Show Data Table"}
                </button>

                {showTable && (
                    <div id={tableId} className="security-data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Before NFKC</th>
                                    <th>After NFKC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((metric) => (
                                    <tr key={metric.label}>
                                        <td>{metric.name}</td>

                                        {metric.values.map((item) => (
                                            <td key={item.phase}>
                                                {item.value.toFixed(1)}%
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </figure>
        </section>
    );
}
