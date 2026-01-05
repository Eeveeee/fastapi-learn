
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import (
    COOKIE_DOMAIN,
    COOKIE_SAMESITE,
    COOKIE_SECURE,
    REFRESH_COOKIE_NAME,
    REFRESH_COOKIE_PATH,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_payload,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.login import Login
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserPrivate

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path=REFRESH_COOKIE_PATH,
        domain=COOKIE_DOMAIN,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        key=REFRESH_COOKIE_NAME,
        path=REFRESH_COOKIE_PATH,
        domain=COOKIE_DOMAIN,
    )

@router.get("/me", response_model=UserPrivate)
async def getme(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/login", response_model=Token)
async def login(
    response: Response,
    payload: Login,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.username == payload.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400, detail={"message":"Invalid credentials","reason":"INVALID_CREDENTIALS"})

    access = create_access_token(subject=str(user.id))

    refresh_jwt, jti, issued_at, expires_at = create_refresh_token(
        subject=str(user.id)
    )

    db.add(
        RefreshToken(
            user_id=user.id,
            jti=jti,
            issued_at=issued_at,
            expires_at=expires_at,
        )
    )
    await db.commit()

    _set_refresh_cookie(response, refresh_jwt)
    return Token(access_token=access)


@router.post("/refresh", response_model=Token)
async def refresh(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    refresh_jwt = request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_jwt:
        raise HTTPException(status_code=401, detail={"message":"Missing refresh token","reason":"MISSING_REFRESH_TOKEN"})

    payload = decode_refresh_payload(refresh_jwt)
    jti = payload["jti"]
    user_id = int(payload["sub"])

    result = await db.execute(
        select(RefreshToken).where(RefreshToken.jti == jti)
    )
    token = result.scalar_one_or_none()

    if not token or token.revoked or token.expires_at <= datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail={"message":"Invalid refresh token","reason":"INVALID_REFRESH_TOKEN"})

    new_refresh, new_jti, issued_at, expires_at = create_refresh_token(
        subject=str(user_id)
    )

    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.jti == jti)
        .values(
            revoked=True,
            revoked_at=datetime.now(timezone.utc),
            replaced_by_jti=new_jti,
        )
    )

    db.add(
        RefreshToken(
            user_id=user_id,
            jti=new_jti,
            issued_at=issued_at,
            expires_at=expires_at,
        )
    )
    await db.commit()

    _set_refresh_cookie(response, new_refresh)
    return Token(access_token=create_access_token(subject=str(user_id)))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    refresh_jwt = request.cookies.get(REFRESH_COOKIE_NAME)
    _clear_refresh_cookie(response)

    if not refresh_jwt:
        return

    try:
        payload = decode_refresh_payload(refresh_jwt)
    except HTTPException:
        return

    await db.execute(
        update(RefreshToken)
        .where(RefreshToken.jti == payload["jti"])
        .values(
            revoked=True,
            revoked_at=datetime.now(timezone.utc),
        )
    )
    await db.commit()

@router.post("/signup", response_model=UserPrivate)
async def signIn(payload: UserCreate, db: AsyncSession = Depends(get_db)):


    user = User(
    username=payload.username,
    email=str(payload.email),
    password_hash=hash_password(payload.password),
    first_name=payload.first_name,
    last_name=payload.last_name,
    gender=payload.gender,
    )
    try:
        db.add(user)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")
    await db.refresh(user)

    return user
