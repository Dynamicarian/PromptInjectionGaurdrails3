import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  ReferenceLine, CartesianGrid, ResponsiveContainer, 
} from "recharts";
import "../charts.css";
import api from "../../../api";

export default function ThresholdChart() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/threshold_report");
        setRows(res.data);
        // start near the SVM default threshold of 0
        const start = res.data.reduce(
          (best, r, i) =>
            Math.abs(r.threshold) < Math.abs(res.data[best].threshold) ? i : best, 0);
        setIndex(start);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

    if (error) return <p className="chart-status error">Error: {error}</p>;
    if (!rows) return <p className="chart-status">Loading...</p>;

  const current = rows[index];

return (
  <div className="chart-card">
    <h2 className="chart-title">Metrics by decision threshold</h2>

    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="threshold" type="number" domain={["dataMin", "dataMax"]} />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="precision" stroke="#2a78d6" dot={false} />
        <Line type="monotone" dataKey="recall" stroke="#eb6834" dot={false} />
        <Line type="monotone" dataKey="f1" stroke="#1baf7a" dot={false} />
        <ReferenceLine x={current.threshold} stroke="#888" strokeDasharray="4 4" />
      </LineChart>
    </ResponsiveContainer>

    <input
      className="threshold-slider"
      type="range"
      min={0}
      max={rows.length - 1}
      value={index}
      onChange={(e) => setIndex(Number(e.target.value))}
    />
    <p className="threshold-value">Decision threshold: {current.threshold}</p>

    <div className="threshold-stats">
      <div className="stat-tile">
        <span className="stat-label">Precision</span>
        <span className="stat-value">{current.precision}</span>
      </div>
      <div className="stat-tile">
        <span className="stat-label">Recall</span>
        <span className="stat-value">{current.recall}</span>
      </div>
      <div className="stat-tile">
        <span className="stat-label">F1</span>
        <span className="stat-value">{current.f1}</span>
      </div>
      <div className="stat-tile good">
        <span className="stat-label">Attacks caught (TP)</span>
        <span className="stat-value">{current.tp}</span>
      </div>
      <div className="stat-tile bad">
        <span className="stat-label">Attacks missed (FN)</span>
        <span className="stat-value">{current.fn}</span>
      </div>
      <div className="stat-tile bad">
        <span className="stat-label">False alarms (FP)</span>
        <span className="stat-value">{current.fp}</span>
      </div>
    </div>
  </div>
);
}