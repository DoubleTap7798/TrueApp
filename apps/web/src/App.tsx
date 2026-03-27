import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type HealthResponse = {
  status: string;
};

export default function App() {
  const [message, setMessage] = useState("Checking API...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${apiBaseUrl}/health`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: HealthResponse = await res.json();
        setMessage(`API status: ${data.status}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    checkHealth();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>TrueApp Web Starter</h1>
      <p>{message}</p>
      {error ? <p style={{ color: "red" }}>API error: {error}</p> : null}
      <p>API Base URL: {apiBaseUrl}</p>
    </main>
  );
}