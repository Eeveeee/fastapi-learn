from fastapi import FastAPI
from pydantic.main import BaseModel

app = FastAPI()
users = []
class createUser(BaseModel):
    name:str
    age:int

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
async def addUser(payload:createUser):
    users.append(payload)
    return "OK"
