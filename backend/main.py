from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

# Define a Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    user_input = req.message