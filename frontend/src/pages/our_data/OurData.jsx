import EmbeddingViz from "./charts/attack_type_embedding";
import DonutChart from "./charts/DonutChart";
import ThresholdChart from "./charts/Threshold";
import "./charts.css";

function OurData() {
  return (
    <main className="our-data">

      <section aria-labelledby="distribution-heading">
        <h2 id="distribution-heading">Prompt Distribution</h2>
        <p className="data-description">
          The dataset contains 10,631 prompts, each labelled benign or malicious. The chart shows
          how many fall into each class. Hover over the segments to see the exact numbers.
        </p>
        <DonutChart />
      </section>

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading">Model Metrics</h2>
        <p className="data-description">
          The chart shows how precision, recall and F1 change as the decision threshold moves. A
          prompt is blocked when the model’s malicious score is at or above the threshold.
        </p>
        <ThresholdChart />
      </section>

      <section aria-labelledby="embedding-heading">
        <h2 id="embedding-heading">Attack Type Data Embedding Visualisation (3D)</h2>
        <p className="data-description">
          The chart shows how the model has learned to separate the different attack types in a 3D
          space. Each point is a prompt, and the colour indicates the attack type. Hover over points
          to see the prompt text. Hold left click and drag to rotate the chart, hold right click to
          pan, and scroll to zoom in and out. You can also use the buttons in the top right corner
          to change the view.
        </p>
        <EmbeddingViz />
      </section>
    </main>
  );
}

export default OurData;