
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr

GenderLiteral = Literal["male", "female"]

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    gender: GenderLiteral
    password: str


class UserPublic(BaseModel):
    # tells FastAPI/Pydantic to read data from object attributes (user.id),
    # not from dict keys (user["id"])
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    first_name: str
    last_name: str
    gender: GenderLiteral
    is_active: bool
    role: str


class UserPrivate(BaseModel):
    # tells FastAPI/Pydantic to read data from object attributes (user.id),
    # not from dict keys (user["id"])
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    gender: GenderLiteral
    is_active: bool
    role: str
