# LLM项目训练

记录自己第一次动手实现完整大语言模型程序，实现前端和后端，做出一个能在网页上聊天的大语言模型程序。



## 后端实现

### FastAPI实现聊天接口

**功能目标**：

- 提供/chat接口

  ```python
  @app.post("/chat")
  def chat(req: ChatRequest):
      user_input = req.message.strip()
  ```

  当收到一个POST请求并且路径为"/chat"时，解析请求体，期望请求体需符合ChatRequest类型(包含一个"message"字段，类型为字符串)，调用被装饰的函数（这里是chat函数）来处理该请求

- 接受用户输入

  ```python
  class ChatRequest(BaseModel):
      message: str
  ```

- 调用模型API

  根据[官方文档](https://www.volcengine.com/docs/82379/1494384)提供的请求参数和响应参数，构建请求头并调用模型，收到响应后解析模型生成的消息内容

- 返回模型响应结果

  ```python
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
  ```

**启动后端：**

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## 前端实现

#### React 实现网页界面

 **功能目标**：

- 输入框输入文字

- “发送”后调用 后端chat函数

  提供向后端调用接口，用户发送数据后，前端需要向后端发送POST请求

- 显示模型回复

