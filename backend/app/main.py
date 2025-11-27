from fastapi import FastAPI
from app.core.config import settings
from app.db import init_db
from app.api.v1 import skins, alerts
from app.collector import run_collector_sync
from apscheduler.schedulers.background import BackgroundScheduler
import csv, os

app = FastAPI(title='CS Pump Tracker')
app.include_router(skins.router, prefix='/api/v1/skins')
app.include_router(alerts.router, prefix='/api/v1/alerts')

@app.on_event('startup')
def startup():
    init_db()
    # carregar skins list
    try:
        if os.path.exists(settings.SKINS_CSV):
            with open(settings.SKINS_CSV, 'r', encoding='utf-8') as f:
                names = [r[0] for r in csv.reader(f) if r]
        else:
            names = ['AK-47 | Neon Rider (Field-Tested)']
    except Exception:
        names = ['AK-47 | Neon Rider (Field-Tested)']
    # schedule collector every 30 minutes
    sched = BackgroundScheduler()
    sched.add_job(lambda: run_collector_sync(names), 'interval', minutes=30, next_run_time=None)
    sched.start()
