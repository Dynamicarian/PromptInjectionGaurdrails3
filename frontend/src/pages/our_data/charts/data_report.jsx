import { useState, useEffect } from "react";
import api from "../../../api";
import "../charts.css";

export default function DataReport() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get("/model_report");
        setResult(response.data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!result) return <p>Loading...</p>;
  return <h1>{result.f1}</h1>;
}