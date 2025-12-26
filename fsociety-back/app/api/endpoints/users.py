from fastapi import Depends
from fastapi.routing import APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserPublic])
async def list_users(db: AsyncSession = Depends(get_db),_:User=Depends(get_current_user)):
    """
    Important concepts here:
     `db` is an AsyncSession (NOT a TCP connection!)
     The session BORROWS a TCP connection from the pool
     ONLY when it needs to execute SQL.
     After the request finishes, the connection is returned to the pool.
    """

    # Build a SQL query: SELECT * FROM users;
    stmt = select(User)

    # Execute the query using a pooled TCP connection
    result = await db.execute(stmt)

    # Extract ORM objects from the result
    users = result.scalars().all()

    return list(users)
#TODO: CREATION OF A USER
