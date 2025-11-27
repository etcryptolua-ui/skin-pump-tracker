"use client";

import { useState } from "react";

export default function Home() {
  const [itemId, setItemId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchData() {
    if (!itemId) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/buff?itemId=${itemId}`);

      if (!res.ok) {
        setError("Erro ao buscar dados.");
        setLoading(false);
        return;
      }

      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (e) {
      setError("Erro de rede.");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        maxWidth: 600,
        margin: "auto",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Buff Pump Detector</h1>

      <input
        type="text"
        placeholder="ID da skin no Buff (goods_id)"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={fetchData}
        style={{
          width: "100%",
          padding: 12,
          background: "#4f46e5",
          color: "white",
          borderRadius: 6,
          border: "none",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Buscar
      </button>

      {loading && <p style={{ marginTop: 20 }}>Carregando...</p>}
      {error && (
        <p style={{ marginTop: 20, color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {data && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Dados coletados</h2>

          <p><strong>Menor preço no Buff:</strong> ¥ {data.lowest_price}</p>
          <p><strong>Preço da Steam (Buff):</strong> ¥ {data.steam_price}</p>
          <p><strong>Quantidade à venda:</strong> {data.sell_count}</p>

          <h3 style={{ marginTop: 15 }}>Possível Pump?</h3>
          {data.sell_count < 50 ? (
            <p style={{ color: "red" }}>
              🔥 Estoque muito baixo → possível início de pump
            </p>
          ) : (
            <p style={{ color: "green" }}>
              Estoque estável → sem sinais fortes de pump
            </p>
          )}
        </div>
      )}
    </div>
  );
}
