

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from fastapi import HTTPException, status
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from app.core.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    REFRESH_TOKEN_EXPIRE_DAYS,
    SECRET_KEY,
)

# -------------------------------------------------
# Password hashing (pwdlib)
# -------------------------------------------------

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash password for DB storage."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify user password."""
    return password_hash.verify(plain_password, hashed_password)


# -------------------------------------------------
# Time helpers
# -------------------------------------------------

def _now() -> datetime:
    """Single source of UTC time."""
    return datetime.now(timezone.utc)


# -------------------------------------------------
# Token creation
# -------------------------------------------------

def create_access_token(subject: str) -> str:
    """
    Access JWT for Authorization: Bearer <token>.
    Short-lived.
    """
    now = _now()
    expires_at = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": subject,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(subject: str) -> tuple[str, str, datetime, datetime]:
    """
    Refresh JWT for /auth/refresh only.
    Long-lived. Includes jti.
    Returns: (jwt_str, jti, issued_at, expires_at)
    """
    now = _now()
    expires_at = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    jti = uuid4().hex

    payload = {
        "sub": subject,
        "type": "refresh",
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, now, expires_at


# -------------------------------------------------
# Token decoding
# -------------------------------------------------

def decode_access_subject(token: str) -> str:
    """Decode access JWT and return subject (sub)."""
    payload = _decode(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    subject = payload.get("sub")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )
    return subject


def decode_refresh_payload(token: str) -> dict:
    """Decode refresh JWT and return payload (requires sub + jti)."""
    payload = _decode(token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong token type",
        )

    if not payload.get("sub") or not payload.get("jti"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload",
        )
    return payload


def _decode(token: str) -> dict:
    """
    Internal helper:
    - validates signature
    - validates exp
    - validates algorithm
    Does NOT validate token "type".
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
