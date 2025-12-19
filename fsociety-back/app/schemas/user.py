
from typing import Literal

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    gender:Literal["male", "female"]
    password: str

class UserPublic(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    gender:Literal["male", "female"]
    is_active: bool = True
    role: str = "user"
    class Config:
        from_attributes = True

class UserPrivate(BaseModel):
    id: int
    username: str
    email: EmailStr
