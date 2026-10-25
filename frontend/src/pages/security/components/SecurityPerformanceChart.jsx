import { useId, useState } from "react";

// SVG dimensions
const W = 650;
const H = 300;
const M = { top: 25, right: 20, bottom: 50, left: 65 };

const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;

// Two lines: without NFKC and with NFKC
const SERIES = [
    {
        key: "without_nfkc",
        label: "Without NFKC",
        color: "#6366f1"
    },
    {
        key: "with_nfkc",
        label: "With NFKC",
        color: "#16a34a"
    }
];

export default function SecurityPerformanceChart({ records }) {

    const [variant, setVariant] = useState("Original");
    const [activeIndex, setActiveIndex] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const tableId = useId();

    // Select original or fullwidth benchmark samples
    const data = records
        .filter((row) => row.variant === variant)
        .sort((a, b) => a.sample - b.sample);
    if (data.length === 0) {
        return <p>No benchmark data available.</p>;
    }

    // Automatically adjust the Y-axis for each prompt variant
    const maxTime = Math.max(
        ...data.flatMap((row) =>
            SERIES.map((series) => row[series.key])
        )
    );

    const maxValue = Math.max(
        0.01,
        Math.ceil(maxTime * 1.15 * 100) / 100
    );

    // Convert a sample index into an SVG X coordinate
    const x = (index) =>
        M.left + (index / Math.max(1, data.length - 1)) * PLOT_W;

    // Convert processing time into an SVG Y coordinate
    const y = (time) =>
        M.top + PLOT_H - (time / maxValue) * PLOT_H;

    // Draw a line connecting all 200 measurements
    function linePath(key) {
        return data.map((row, index) =>
            `${index === 0 ? "M" : "L"}${x(index)},${y(row[key])}`
        ).join(" ");
    }

    // Find the nearest sample to the mouse position
    function handlePointerMove(event) {

        const box = event.currentTarget.getBoundingClientRect();
        const mouseX =
            ((event.clientX - box.left) / box.width) * W;
        const step = PLOT_W / Math.max(1, data.length - 1);
        const index = Math.round((mouseX - M.left) / step);

        setActiveIndex(
            Math.max(0, Math.min(data.length - 1, index))
        );
    }

    // Currently selected measurement
    const active = activeIndex === null
        ? null
        : data[activeIndex];
    // Create 5 Y-axis labels
    const ticks = Array.from(
        { length: 5 },
        (_, i) => (maxValue / 4) * i
    );

    // Create X-axis labels across the 200 samples
    const xTicks = [0, 0.25, 0.5, 0.75, 1].map(
        (fraction) => Math.round(fraction * (data.length - 1))
    );
    return (
        <section className="security-performance-section">

            <h2>NFKC Performance Benchmark</h2>
            <p>
                Average processing time per prompt across 200 measurement samples.
            </p>
            <div className="security-performance-card">

                {/* Switch between original and fullwidth prompts */}
                <div className="security-performance-filter">
                    <label htmlFor="benchmark-variant">
                        Prompt Variant:
                    </label>

                    <select
                        id="benchmark-variant"
                        value={variant}
                        onChange={(e) => {
                            setVariant(e.target.value);
                            setActiveIndex(null);
                        }}
                    >
                        <option value="Original">Original</option>
                        <option value="Fullwidth">Fullwidth</option>
                    </select>
                </div>

                {/* Line colours */}
                <div className="security-performance-legend">
                    {SERIES.map((series) => (
                        <span key={series.key}>
                            <i style={{ background: series.color }} />
                            {series.label}
                        </span>
                    ))}
                </div>

                <div className="security-performance-chart">

                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        role="img"
                        aria-label={`Line chart comparing NFKC processing times for ${variant.toLowerCase()} prompts across ${data.length} measurement samples`}
                        onPointerMove={handlePointerMove}
                        onPointerLeave={() => setActiveIndex(null)}
                    >

                        {/* Y-axis gridlines and time labels */}
                        {ticks.map((tick, index) => (
                            <g key={index}>
                                <line
                                    className="security-chart-gridline"
                                    x1={M.left}
                                    x2={W - M.right}
                                    y1={y(tick)}
                                    y2={y(tick)}
                                />

                                <text
                                    className="security-chart-axis-label"
                                    x={M.left - 8}
                                    y={y(tick)}
                                    textAnchor="end"
                                    dominantBaseline="middle"
                                >
                                    {tick.toFixed(2)}
                                </text>
                            </g>
                        ))}

                        {/* Sample numbers along the X-axis */}
                        {xTicks.map((index) => (
                            <text
                                key={index}
                                className="security-chart-axis-label"
                                x={x(index)}
                                y={H - M.bottom + 20}
                                textAnchor="middle"
                            >
                                {data[index].sample}
                            </text>
                        ))}

                        {/* Y-axis title */}
                        <text
                            className="security-chart-axis-label"
                            x={M.left}
                            y={12}
                        >
                            Time (µs)
                        </text>

                        {/* X-axis title */}
                        <text
                            className="security-chart-axis-label"
                            x={M.left + PLOT_W / 2}
                            y={H - 6}
                            textAnchor="middle"
                        >
                            Measurement Sample
                        </text>

                        {/* Draw both lines */}
                        {SERIES.map((series) => (
                            <path
                                key={series.key}
                                d={linePath(series.key)}
                                fill="none"
                                stroke={series.color}
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        ))}

                        {/* Crosshair and markers for selected sample */}
                        {active && (
                            <g>
                                <line
                                    x1={x(activeIndex)}
                                    x2={x(activeIndex)}
                                    y1={M.top}
                                    y2={y(0)}
                                    stroke="#9ca3af"
                                    strokeDasharray="4 4"
                                />

                                {SERIES.map((series) => (
                                    <circle
                                        key={series.key}
                                        cx={x(activeIndex)}
                                        cy={y(active[series.key])}
                                        r="4"
                                        fill={series.color}
                                    />
                                ))}
                            </g>
                        )}
                    </svg>

                    {/* Hover information */}
                    {active && (
                        <div className="security-performance-tooltip">
                            <strong>Sample {active.sample}</strong>
                            {SERIES.map((series) => (
                                <span key={series.key}>
                                    {series.label}:{" "}
                                    {active[series.key].toFixed(4)} µs
                                </span>
                            ))}
                        </div>
                    )}

                </div>
                {/* Show or hide the measurement table */}
                <button
                    type="button"
                    className="security-table-toggle"
                    aria-expanded={showTable}
                    aria-controls={tableId}
                    onClick={() => setShowTable(!showTable)}
                >
                    {showTable ? "Hide Data Table" : "Show Data Table"}
                </button>

                <div
                    id={tableId}
                    className="security-data-table"
                    hidden={!showTable}
                >
                    <table>
                        <thead>
                            <tr>
                                <th>Sample</th>
                                <th>Without NFKC (µs)</th>
                                <th>With NFKC (µs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.sample}>
                                    <td>{row.sample}</td>
                                    <td>
                                        {row.without_nfkc.toFixed(4)}
                                    </td>
                                    <td>
                                        {row.with_nfkc.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
