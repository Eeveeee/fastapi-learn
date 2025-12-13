import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

# ---------------------------------------------------------------------
# IMPORTANT CONCEPTS (read this once)
# ---------------------------------------------------------------------
# 1) "Engine" holds configuration + a connection pool.
# 2) A "Connection" is a real TCP connection to Postgres (expensive to open).
# 3) A "Session" is NOT a TCP connection. It's a unit-of-work / transactional context.
#
# What we do in web apps:
# - Keep a pool of TCP connections alive inside the Engine (24/7 is normal).
# - For each HTTP request: create a Session, borrow a TCP connection from the pool,
#   run queries, then RETURN the TCP connection back to the pool.
#
# So we do NOT open a brand-new TCP connection per request in normal operation;
# we reuse pooled connections.
# ---------------------------------------------------------------------


DATABASE_URL_ASYNC = os.environ["DATABASE_URL_ASYNC"]

# Create an async Engine.
# - This initializes the pool configuration.
# - It does NOT necessarily open TCP connections immediately; connections are typically
#   opened lazily when first used.
engine: AsyncEngine = create_async_engine(
    DATABASE_URL_ASYNC,
    echo=False,  # set True to print SQL statements (debugging)
    pool_pre_ping=True,  # checks connections are alive before using them
)

# Session factory.
# - expire_on_commit=False prevents objects from expiring after commit,
#   which is convenient for returning data in FastAPI responses.
SessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)


# Base class for ORM models.
# All your tables (models) should inherit from Base.
class Base(DeclarativeBase):
    pass


# FastAPI dependency:
# - One Session per request (safe concurrency).
# - Session borrows a TCP connection from the pool when it needs to talk to DB.
# - On exit, Session returns the connection to the pool.
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            # Explicit close is handled by the context manager,
            # but leaving this comment to emphasize the lifecycle:
            # "close" returns the borrowed connection back to the pool.
            await session.close()
