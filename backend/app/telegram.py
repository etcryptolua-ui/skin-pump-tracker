import requests
from app.core.config import settings

def send_alert(text):
    token = settings.TELEGRAM_BOT_TOKEN
    chat = settings.TELEGRAM_CHAT_ID
    if not token or not chat:
        print('telegram not configured')
        return False
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = {'chat_id': chat, 'text': text, 'parse_mode':'HTML'}
    try:
        r = requests.post(url, data=payload, timeout=10)
        return r.status_code == 200
    except Exception as e:
        print('tg error', e)
        return False
