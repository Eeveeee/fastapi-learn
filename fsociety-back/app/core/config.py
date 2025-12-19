
import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL_ASYNC")
ACCESS_TOKEN_EXPIRE = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
if not DATABASE_URL or not ACCESS_TOKEN_EXPIRE:
    raise RuntimeError("DATABASE_URL_ASYNC or DATABASE_URL_SYNC must be set in .env")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE)
