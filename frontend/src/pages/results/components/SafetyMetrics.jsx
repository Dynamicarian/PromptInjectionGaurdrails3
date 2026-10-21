import ConfidenceDonut from './ConfidenceDonut.jsx';

function SafetyMetrics({ categories = [], status, attackTypeConfidences = null }) {
    return (
        <section className="safety-metrics">
            <ConfidenceDonut
                status={status}
                confidences={attackTypeConfidences}
            />
        </section>
    );
}

export default SafetyMetrics;
