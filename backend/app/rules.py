from app.db import SessionLocal
from datetime import datetime, timedelta

RULES = {
    'stock_drop_pct': 40,
    'price_increase_pct': 10,
    'min_listings_threshold': 3
}

def analyze_skin(skin_name):
    db = SessionLocal()
    since = datetime.utcnow() - timedelta(hours=48)
    q = "SELECT skin_name, price, stock, ts FROM snapshots WHERE skin_name=:s AND ts>=:since ORDER BY ts ASC"
    rows = db.execute(q, {'s': skin_name, 'since': since}).fetchall()
    db.close()
    if not rows or len(rows) < 2:
        return None
    prices = [r[1] for r in rows]
    stocks = [r[2] for r in rows]
    price_inc = (prices[-1] - prices[0]) / max(1, prices[0]) * 100
    stock_drop = (stocks[0] - stocks[-1]) / max(1, stocks[0]) * 100
    flags = []
    if price_inc >= RULES['price_increase_pct']:
        flags.append('price_increase')
    if stock_drop >= RULES['stock_drop_pct'] and stocks[-1] <= RULES['min_listings_threshold']:
        flags.append('stock_drop')
    if all(prices[i] < prices[i+1] for i in range(len(prices)-1)) and len(prices) >= 4:
        flags.append('sequential_up')
    return {'skin': skin_name, 'price_inc_pct': round(price_inc,2), 'stock_drop_pct': round(stock_drop,2), 'flags': flags}
