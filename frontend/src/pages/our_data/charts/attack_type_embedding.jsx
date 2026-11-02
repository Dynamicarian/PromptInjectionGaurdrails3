import "../charts.css";

export default function EmbeddingViz() {
  return (
    <div className="chart-card">
      <h2 className="chart-title">Attack type embeddings (3D)</h2>
      <iframe
        className="embedding-frame"
        src="/attack_type_embeddings_visualization_3d.html"
        title="Attack Type Data Embeddings 3D"
      />
    </div>
  );
}