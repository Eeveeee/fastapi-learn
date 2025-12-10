from fastapi import FastAPI

app = FastAPI()
users = []

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
async def addUser(value):
    users.append(value)
    return "OK"
