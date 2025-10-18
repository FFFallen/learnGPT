from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import openai
import os

app = FastAPI()

API_KEY = os.environ.get("ARK_API_KEY")
API_URL = "https://ark.cn-beijing.volces.com/api/v3" 

# Define a Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(req: ChatRequest):
    user_input = req.message

    # Prepare request to external AI service
    headers = {"Authorization": API_KEY} # 请求头
    data = {
        "model": "doubao-seed-1.6-lite",       # JSON 数据
        "messages": [{"role": "user", "content": user_input}],
    }

    try:
        
        # Call the external AI service & get response
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()  # 检查请求是否成功

        # 解析JSON响应  取出回复内容
        res_json = response.json()
        if 'choices' in res_json and len(res_json['choices']) > 0:
            reply = res_json['choices'][0]['message']['content']
            return {"reply": reply}
        else:
            raise HTTPException(status_code=500, detail="API响应中未找到有效的回复")
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"请求外部API时发生错误: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"解析API响应时发生错误: {str(e)}")