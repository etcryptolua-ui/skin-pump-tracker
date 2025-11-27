export async function fetchBuffItem(itemId: string) {
  const url = `https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${itemId}&page=1&page_size=30`;
  
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://buff.163.com/",
    },
    next: { revalidate: 5 },
  });

  if (!res.ok) {
    return { error: true, status: res.status };
  }

  const data = await res.json();
  return data;
}
