import { useState, useRef, useEffect} from 'react'
import { sendMessage } from './api'
import './App.css'

const USER_AVATAR = '/user-avatar.png'; // 公众文件夹下的用户头像
const AI_AVATAR = '/ai-avatar.png';     // 公众文件夹下的AI头像

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [darkMode, setDarkMode] = useState(false);   // 深色模式
  const messagesEndRef = useRef(null); // 滚动到底部引用

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 切换深色/浅色模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSend = async () => {
    if (!input.trim()) return(alert("不能发送空消息！"));

    // Create user message and update state
    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    // Clear input field
    setInput('');

    const reply = await sendMessage(input);
    const botMsg = { sender: 'assistant', text: reply };
    setMessages(prev => [...prev, botMsg]);
  }; 

    // 回车发送
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // 不按shift的回车发送
      e.preventDefault();
      handleSend();
    }
  };

return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 顶部导航栏 */}
      <header className="border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 bg-opacity-90 backdrop-blur-sm transition-all duration-300 
        dark:border-gray-700 dark:bg-gray-900 
        light:border-gray-200 light:bg-white">
        <div className="flex items-center gap-2">
          <img src={AI_AVATAR} alt="AI图标" className="w-8 h-8 rounded-full" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">AI 智能助手</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* 深色模式切换按钮 */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? "切换浅色模式" : "切换深色模式"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.126.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.63 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 聊天区域 */}
      <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-6 message-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* 头像 */}
              <img
                src={msg.sender === 'user' ? USER_AVATAR : AI_AVATAR}
                alt={`${msg.sender} avatar`}
                className="w-10 h-10 rounded-full mt-1 shrink-0"
              />
              <div className={`ml-3 mr-3 max-w-[80%]`}>
                {/* 消息气泡 */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200
                    ${msg.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-tr-none hover:bg-blue-600' 
                      : darkMode 
                        ? 'bg-gray-800 text-white rounded-tl-none hover:bg-gray-700' 
                        : 'bg-white text-gray-800 rounded-tl-none hover:bg-gray-50'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {/* 时间戳 */}
                  <p className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex justify-start">
              <img src={AI_AVATAR} alt="AI loading" className="w-10 h-10 rounded-full mt-1 shrink-0" />
              <div className="ml-3 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* 滚动到底部的锚点 */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 输入区域 */}
      <footer className="border-t p-4 sticky bottom-0 z-10 transition-colors duration-300
        dark:border-gray-700 dark:bg-gray-900
        light:border-gray-200 light:bg-white">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息...（按Enter发送，Shift+Enter换行）"
              className="flex-1 border rounded-2xl px-4 py-3 resize-none min-h-[60px] max-h-[200px]
                dark:border-gray-700 dark:bg-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shrink-0
                disabled:bg-blue-300 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="animate-spin">
                  <path d="M8 3a5 5 0 0 0-3.546 8.547A5 5 0 0 0 8 13a5 5 0 0 0 3.546-8.547A5 5 0 0 0 8 3zm0 1a4 4 0 0 1 2.286 7.286A4 4 0 0 1 8 12a4 4 0 0 1-2.286-7.286A4 4 0 0 1 8 4z"/>
                  <path d="M8 6a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H8zm0 2a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H8zm1 0a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H9zm-1 2a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H8zm1 0a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H9zm-1 2a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H8zm1 0a.5.5 0 0 0 0 1h.5a.5.5 0 0 0 0-1H9z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.033a.5.5 0 0 1 .54.11ZM6.636 10.07l2.767-4.334L14.13 2.576 6.636 10.07Zm-4.44 5.567L8.5 1.436l4.326 14.13a.75.75 0 0 1-1.324.126L6.636 10.07l-5.215 8.572a.75.75 0 0 1-1.174-.933Z"/>
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-center mt-2 opacity-60">
            支持Markdown格式 | 按Enter发送 | Shift+Enter换行
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
