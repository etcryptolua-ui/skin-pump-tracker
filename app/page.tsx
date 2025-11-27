"use client";

import { useState } from "react";

export default function Home() {
  const [itemId, setItemId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    if (!itemId) return;

    setLoading(true);

    const res = await fetch(`/api/buff?itemId=${itemId}`);
    const json = await res.json();

    setData(json);
    setLoading(false);
  }

  // --- ANALISADOR DE PUMP ---
  let analysis = null;

  if (data && data.data && data.data.items) {
    const offers = data.data.items;

    const prices = offers.map((o: any) => parseFloat(o.price));
    const stock = offers.length;
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const spread = prices[1] ? prices[1] - prices[0] : 0;
    const pricePressure = (prices[0] / avgPrice) * 100;

    let risk = 0;
    if (spread > 5) risk += 30;
    if (pricePressure > 105) risk += 30;
    if (stock < 20) risk += 40;

    let label = "Normal";
    let color = "#4CAF50";

    if (risk >= 40 && risk < 70) {
      label = "Possível pump iniciando";
      color = "#FFC107";
    } else if (risk >= 70) {
      label = "⚠️ PUMP forte em andamento!";
      color = "#F44336";
    }

    analysis = {
      stock,
      minPrice,
      avgPrice: Number(avgPrice.toFixed(2)),
      spread,
      risk,
      label,
      color,
    };
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Buff Monitor – Pump Detector</h1>

      <input
        type="text"
        placeholder="ID da skin no Buff (goods_id)"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        style={{
          padding: 10,
          width: "100%",
          marginBottom: 10,
          border: "1px solid #ccc",
          borderRadius: 5,
        }}
      />

      <button
        onClick={fetchData}
        style={{
          padding: "10px 20px",
          width: "100%",
          background: "#4A76FD",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Buscar dados
      </button>

      {loading && <p style={{ marginTop: 20 }}>Carregando...</p>}

      {data && (
        <div style={{ marginTop: 20 }}>
          <h2>Resultado</h2>

          {/* Bloco de análise */}
          {analysis && (
            <div
              style={{
                background: analysis.color,
                color: "white",
                padding: 15,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <strong>{analysis.label}</strong>
              <p>Estoque atual: {analysis.stock}</p>
              <p>Menor preço: {analysis.minPrice} RMB</p>
              <p>Média das ofertas: {analysis.avgPrice} RMB</p>
              <p>Spread: {analysis.spread.toFixed(2)} RMB</p>
              <p>Índice de pump: {analysis.risk}%</p>
            </div>
          )}

          {/* Lista das ofertas */}
          <ul>
            {data?.data?.items?.map((item: any, index: number) => (
              <li key={index}>
                {item.price} RMB — {item.asset_info?.paintwear}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
