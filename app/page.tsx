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
          margi
