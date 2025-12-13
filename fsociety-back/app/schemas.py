from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    role: str = "user"
    is_active: bool = True


class UserOut(UserCreate):
    id: int
