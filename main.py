# Entry Point of FAST API Application
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Backend is operational"}