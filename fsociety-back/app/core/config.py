
import os

from dotenv import load_dotenv

load_dotenv()

DB_ENV = os.getenv("DATABASE_URL_ASYNC")
ACCESS_TOKEN_EXPIRE = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
REFRESH_TOKEN_EXPIRE_DAYS = os.getenv("REFRESH_TOKEN_EXPIRE_DAYS")
if not DB_ENV or not ACCESS_TOKEN_EXPIRE or not REFRESH_TOKEN_EXPIRE_DAYS:
    raise RuntimeError("DATABASE_URL_ASYNC or DATABASE_URL_SYNC must be set in .env")
DATABASE_URL =  DB_ENV
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE)
REFRESH_TOKEN_EXPIRE_DAYS  = int(REFRESH_TOKEN_EXPIRE_DAYS)

ALGORITHM = "HS256"
REFRESH_COOKIE_NAME = 'refresh_token'
# REFRESH_COOKIE_PATH = '/api/auth/refresh'
REFRESH_COOKIE_PATH = '/'
COOKIE_SECURE = False # https = true
COOKIE_SAMESITE = 'lax' # DOMAIN policy, any domain = None one domain = 'lax'
COOKIE_DOMAIN   = None # Subdomains sharing
