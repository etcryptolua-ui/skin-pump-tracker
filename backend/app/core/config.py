import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'sqlite:///./data.db')
    SCRAPER_DELAY: int = int(os.getenv('SCRAPER_DELAY', '5'))
    TELEGRAM_BOT_TOKEN: str = os.getenv('TELEGRAM_BOT_TOKEN', '')
    TELEGRAM_CHAT_ID: str = os.getenv('TELEGRAM_CHAT_ID', '')
    SECRET_API_KEY: str = os.getenv('SECRET_API_KEY', 'secret')
    SKINS_CSV: str = os.getenv('SKINS_CSV', 'skins.csv')

settings = Settings()
