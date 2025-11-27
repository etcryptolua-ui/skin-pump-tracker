# coletor simples que usa o endpoint de busca público do buff (adaptável)
import time, random, csv, asyncio
import httpx
from app.db import SessionLocal
from app.models import Snapshot
from app.core.config import settings

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
]

SEARCH_URL = 'https://buff.163.com/api/market/goods?game=csgo&q='

async def fetch_skin(session, name):
    q = httpx.utils.quote(name)
    url = SEARCH_URL + q
    headers = {'User-Agent': random.choice(USER_AGENTS), 'Accept-Language':'en-US,en;q=0.9'}
    try:
        r = await session.get(url, headers=headers, timeout=15)
    except Exception as e:
        print('fetch error', e)
        return None
    if r.status_code != 200:
        return None
    try:
        return r.json()
    except Exception:
        return None

async def collect_once(names):
    async with httpx.AsyncClient() as client:
        for name in names:
            data = await fetch_skin(client, name)
            if not data:
                print('no data for', name)
                await asyncio.sleep(settings.SCRAPER_DELAY)
                continue
            try:
                items = data.get('data', {}).get('items', [])
                if not items:
                    print('no items for', name)
                    await asyncio.sleep(settings.SCRAPER_DELAY)
                    continue
                item = items[0]
                price = float(item.get('price', 0) or 0)
                stock = int(item.get('stock', 0) or 0)
                meta = item
                db = SessionLocal()
                snap = Snapshot(skin_name=name, price=price, stock=stock, meta=meta)
                db.add(snap)
                db.commit()
                db.close()
                print('saved', name, price, stock)
            except Exception as e:
                print('parse/save error', e)
            await asyncio.sleep(settings.SCRAPER_DELAY)

# wrapper sync for scheduler
def run_collector_sync(names):
    asyncio.run(collect_once(names))

if __name__ == '__main__':
    # quick local run reading skins.csv
    try:
        with open(settings.SKINS_CSV, 'r', encoding='utf-8') as f:
            names = [r[0] for r in csv.reader(f) if r]
    except Exception:
        names = ['AK-47 | Neon Rider (Field-Tested)']
    run_collector_sync(names)
