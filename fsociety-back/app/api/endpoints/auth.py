
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserPublic

router = APIRouter(tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/token")


@router.post("/register", response_model=UserPublic)
async def register(
    data: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # Проверяем уникальность username/email
    stmt = select(User).where(or_(User.username == data.username, User.email == data.email))
    existing = (await db.execute(stmt)).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/token", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # OAuth2PasswordRequestForm — это form-data, не JSON
    stmt = select(User).where(User.username == form_data.username)
    user = (await db.execute(stmt)).scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject=user.username)
    return Token(access_token=token, token_type="bearer")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    username = decode_token(token)

    stmt = select(User).where(User.username == username)
    user = (await db.execute(stmt)).scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/me", response_model=UserPublic)
async def me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
