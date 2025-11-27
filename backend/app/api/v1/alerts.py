from fastapi import APIRouter
from app.rules import analyze_skin

router = APIRouter()

@router.get('/')
def list_alerts():
    return {'status':'ok'}

@router.get('/analyze/{skin_name}')
def analyze(skin_name: str):
    res = analyze_skin(skin_name)
    return res or {'status':'no_data'}
