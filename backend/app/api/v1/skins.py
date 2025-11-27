from fastapi import APIRouter
from app.db import SessionLocal

router = APIRouter()

@router.get('/')
def list_skins():
    db = SessionLocal()
    # pega o último snapshot por skin (simples)
    res = db.execute("""
        SELECT skin_name, price, stock, ts
        FROM snapshots AS s1
        WHERE ts = (
            SELECT MAX(ts) FROM snapshots s2 WHERE s2.skin_name = s1.skin_name
        )
    """).fetchall()
    db.close()
    out = []
    for r in res:
        out.append({'skin': r[0], 'price': r[1], 'stock': r[2], 'ts': str(r[3])})
    return out
