import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import api from "../../../api";

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

  if (error) return <p>Error: {error}</p>;
  if (!result) return <p>Loading...</p>;

  const chartData = [
    { name: "Benign", value: result.benign_prompt },
    { name: "Malicious", value: result.malicious_prompt },
  ];

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
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

      {/* total in the centre of the donut */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 300,
          height: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: 13, color: "#666" }}>Total prompts</span>
        <strong style={{ fontSize: 28 }}>{result.total}</strong>
      </div>
    </div>
  );
}