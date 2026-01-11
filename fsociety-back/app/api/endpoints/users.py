from fastapi import Depends
from fastapi.routing import APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin_rights
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

@router.get("/{requested_user_id}")
async def get_user(requested_user_id:int,db:AsyncSession = Depends(get_db),currentUser:User=Depends(require_admin_rights)):
   query = select(User).where(User.id==int(requested_user_id)) 
   result = await db.execute(query)
   user = result.scalar_one_or_none()

   return user
#TODO: CREATION OF A USER
