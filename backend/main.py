from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from openai import OpenAI, APIError, APIConnectionError, AuthenticationError
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

origins = [
    "http://localhost:5173",          # 本地调试地址
    "http://10.68.79.150:5173",      # 电脑同子网 IP
    "http://10.68.202.113:5173"      # 电脑原 IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # 允许指定前端源访问
    allow_credentials=True,       # 允许携带 Cookie（可选）
    allow_methods=["*"],          # 允许所有请求方法（POST/OPTIONS 等）
    allow_headers=["*"],          # 允许所有请求头（Content-Type 等）
)

API_KEY = os.environ.get("ARK_API_KEY")
ModelName = "ep-20251107154050-8chqg"
client = OpenAI(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=API_KEY,
)

# Define a Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    user_input = req.message.strip()
    print(f"Received message: {user_input}")

    if not user_input:
        raise HTTPException(status_code=400, detail="输入消息不能为空")
    
    if not API_KEY:
        raise HTTPException(status_code=500, detail="环境变量 ARK_API_KEY 未配置")

    # Prepare request to external AI service
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    } # 请求头
    data = {
        "model": ModelName,       # JSON 数据
        "messages": [{"role": "user", "content": user_input}],
    }

    try:
        
        print(f"Sending request to AI service with data: {data}")

        completion = client.chat.completions.create(
                    model=ModelName,
                    messages=[
                        {
                            "role": "user",
                            "content": user_input  # 纯文本输入
                        }
                    ],
                    reasoning_effort="medium",
                    temperature=0.7,
                    max_tokens=1024
                )
        
        print(f"Received response from AI service: {completion}")

        if completion.choices and len(completion.choices) > 0:
            reply = completion.choices[0].message.content.strip()
            return {"reply": reply}
        else:
            raise HTTPException(status_code=500, detail="API响应中未找到有效的回复")
        
    except AuthenticationError:
        raise HTTPException(status_code=401, detail="API认证失败，请检查API密钥")
    except APIConnectionError:
        raise HTTPException(status_code=503, detail="无法连接到AI服务，请稍后重试")
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"AI服务返回错误: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理请求时发生错误: {e}")