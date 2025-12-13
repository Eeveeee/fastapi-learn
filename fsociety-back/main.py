from fastapi import FastAPI
from pydantic import EmailStr
from pydantic.main import BaseModel

app = FastAPI()
users:list[User] = []
class User(BaseModel):
    id: int
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    is_active: bool

@app.get("/")
async def root():
    return {"message": "Hello World"}
@app.get(f"/users/{id}")
async def getUserById():
    return next((user for user in users if user.id==id), None)
@app.get("/users")
async def getUsers():
    return users
@app.post("/users")
async def addUser(payload:User):
    users.append(payload)
    return "OK"
