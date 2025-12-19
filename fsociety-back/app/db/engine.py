from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import DATABASE_URL

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL_ASYNC or DATABASE_URL_SYNC must be set in .env")

engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    echo=False,  # set True to print SQL statements (debugging)
    pool_pre_ping=True,  # checks connections are alive before using them
)
