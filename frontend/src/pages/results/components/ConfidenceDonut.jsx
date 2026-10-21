import { useState } from 'react';
import DonutChart from './DonutChart.jsx';

const CATEGORIES = [
    { key: 'obfuscation', label: 'Obfuscation', color: '#9b78d6' },
    { key: 'role_playing', label: 'Role Playing', color: '#e4ad55' },
    { key: 'data_leakage', label: 'Data Leakage', color: '#e16b65' },
    { key: 'code_execution', label: 'Code Execution', color: '#5b93d3' },
    { key: 'jailbreaking', label: 'Jailbreaking', color: '#50ab84' }
];

function ConfidenceDonut({ status, confidences = null }) {
    const [hovered, setHovered] = useState(null);
    const isPending = status === 'pending';

    // Check whether all five attack-type scores are available
    const hasScores = confidences &&
        CATEGORIES.every(item =>
            Number.isFinite(confidences[item.key]) &&
            confidences[item.key] >= 0 &&
            confidences[item.key] <= 1
        );

    // Prepare data for the donut chart
    const segments = hasScores && !isPending
        ? CATEGORIES.map(item => ({
            label:item.label,
            value: confidences[item.key],
            color: item.color
        }))
        : [];
    //highlighted category
    const active = hovered === null ? null : segments[hovered];
    return (
        <div className="confidence-donut">
            <h4>Attack Type Confidence</h4>

            <div className="safety-metrics__content">
                <DonutChart
                    segments={segments}
                    hovered={hovered}
                    onHover={setHovered}
                    centerValue={
                        isPending
                            ? "Verifying..."
                            : active
                                ? `${(active.value * 100).toFixed(1)}%`
                                : hasScores
                                    ? "5 Types"
                                    : "N/A"
                    }
                    centerLabel={
                        active ? active.label : "Attack Types"
                    }
                />
                {hasScores && !isPending && (
                    <div className="safety-metrics__legend">
                        {CATEGORIES.map((item, index) => (
                            <div
                                key={item.key}
                                className={
                                    `safety-metrics__legend-item ${
                                        hovered === index ? 'is-active' : ''
                                    }`
                                }
                                tabIndex={0}
                                onPointerEnter={() => setHovered(index)}
                                onPointerLeave={() => setHovered(null)}
                                onFocus={() => setHovered(index)}
                                onBlur={() => setHovered(null)}
                            >
                                <span
                                    className="safety-metrics__swatch"
                                    style={{ backgroundColor: item.color }}
                                />

                                <span>{item.label}</span>

                                <strong>
                                    {(confidences[item.key] * 100).toFixed(1)}%
                                </strong>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfidenceDonut;