
# app/models/refresh_token.py
from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class RefreshToken(Base):
    """
    Stores refresh-token state (revocation/rotation).

    We store jti (token id), not the whole refresh JWT.
    """
    __tablename__ = "refresh_tokens"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )

    # JWT ID: unique identifier of refresh token
    jti: Mapped[str] = mapped_column(String(64), unique=True, index=True)

    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)

    revoked: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # For rotation tracing / replay detection
    replaced_by_jti: Mapped[str | None] = mapped_column(String(64), nullable=True)

    user = relationship("User", back_populates="refresh_tokens")


Index("ix_refresh_tokens_user_active", RefreshToken.user_id, RefreshToken.revoked)
