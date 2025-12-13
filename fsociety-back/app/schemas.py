from typing import Literal

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    role: str = "user"
    is_active: bool = True
    gender:Literal["male", "female"]


class UserOut(UserCreate):
    id: int
