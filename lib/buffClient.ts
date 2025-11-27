export async function fetchBuffItem(itemId: string) {
  const url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${itemId}&page_num=1&page_size=10`;

  // Buff bloqueia user-agents padrão. Vamos simular um navegador.
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Referer": "https://buff.163.com/",
      "Accept": "application/json, text/plain, */*",
    },
    next: { revalidate: 5 }, // cache leve para não cair rate limit
  });

  if (!res.ok) {
    return { error: "Buff bloqueou a requisição", status: res.status };
  }

  const json = await res.json();

  // Estrutura padrão do Buff
  if (!json?.data) {
    return { error: "Item não encontrado ou bloqueado" };
  }

  return {
    lowest_price: json.data.items?.[0]?.price,
    steam_price: json.data.goods_infos?.steam_price,
    sell_count: json.data.total_count,
    raw: json,
  };
}
