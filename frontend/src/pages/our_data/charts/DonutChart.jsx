import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../../../api";
import "../charts.css";

const COLORS = ["#2a78d6", "#eb6834"];

export default function DonutChart() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get("/data");
        setResult(response.data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return <p className="chart-status error">Error: {error}</p>;
  if (!result) return <p className="chart-status">Loading...</p>;

  const chartData = [
    { name: "Benign", value: result.benign_prompt },
    { name: "Malicious", value: result.malicious_prompt },
  ];

  return (
    <div className="chart-card">
      <h2 className="chart-title">Prompt distribution</h2>
      <div className="donut-wrapper">
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={2}
          >
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>

        <div className="donut-center">
          <span className="donut-label">Total prompts</span>
          <strong className="donut-total">{result.total}</strong>
        </div>
      </div>
    </div>
  );
}