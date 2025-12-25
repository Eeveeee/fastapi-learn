

import enum

from sqlalchemy import Boolean, Enum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"


class User(Base):
    __tablename__ = "users"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Unique + indexed fields are common for login-like identifiers
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    password_hash: Mapped[str]

    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))

    role: Mapped[str] = mapped_column(String(50), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    gender: Mapped[Gender] = mapped_column(Enum(Gender), nullable=False)

    #creates relation in db to call user.refresh_tokens, and not select from
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
