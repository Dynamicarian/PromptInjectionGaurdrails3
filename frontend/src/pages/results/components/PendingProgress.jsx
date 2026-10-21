function PendingProgress() {
    return (
        <div className="pending-progress">
            <div
                className="pending-progress-track"
                role="progressbar"
                aria-label="Prompt analysis in progress"
            >
                <div className="pending-progress-bar"></div>
            </div>

            <p>Analysis in progress...</p>
        </div>
    );
}

export default PendingProgress;
