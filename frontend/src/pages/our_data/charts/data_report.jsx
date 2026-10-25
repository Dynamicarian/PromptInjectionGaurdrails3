import { useState, useEffect } from "react";
import api from "../../../api";

export default function DataReport() {
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

  return <h1>{result.total}, {result.benign_prompt}, {result.malicious_prompt}</h1>;
}