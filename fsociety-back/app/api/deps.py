
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_subject
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# TODO: There is fastapi dependency(from Depends(oauth2)) for no token provided, mb i should override it
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:

    subject = decode_access_subject(token)

    try:
        user_id = int(subject)
    except ValueError:
        raise HTTPException(status_code=401, detail={"message":"Invalid subject in token","reason":"INVALID_SUBJECT_IN_TOKEN"})

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail={"message":"No such user","reason":"INVALID_USER_OR_INACTIVE"})

    return user

async def require_admin_rights(current_user:User=Depends(get_current_user)):
    #TODO: make more advanced role system and ENUM for roles
    if not current_user.role=='admin':
     raise HTTPException(status_code=403, detail={"message":"Insufficient rights","status_code":"INVALID_RIGHTS"})
    return current_user
