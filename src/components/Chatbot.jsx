import { useState, useRef, useEffect } from 'react';
import { chatbotAnalysis } from '../api/chatbot';
import TopBar from './TopBar';
import { Send, Bot, User, Loader, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Hello! I am your agricultural assistant. Ask me anything about crops, soil, weather, or farming techniques.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const uid = localStorage.getItem('uid');
      const question = language === 'hi'
        ? `Please respond in Hindi: ${userMessage}`
        : userMessage;

      const response = await chatbotAnalysis(uid, question);

      setMessages(prev => [
        ...prev,
        { role: 'bot', content: response.reply_text || response.reply || 'I apologize, but I could not generate a response.' }
      ]);
    } catch (error) {
      toast.error('Failed to get response from chatbot');
      setMessages(prev => [
        ...prev,
        { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar title="Farmer Chatbot" />

      <div className="ml-20 flex-1 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="p-6 flex-1 flex flex-col">
          <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AgriBot</h3>
                  <p className="text-xs text-gray-500">Your farming assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Globe className="w-4 h-4 text-gray-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border-none focus:ring-0 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Bot className="w-6 h-6 text-gray-600" />
                    )}
                  </div>

                  <div
                    className={`max-w-2xl px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-green-500 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                    <Bot className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Type your message here...'}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setInput('What are the best crops for clay soil?')}
                  className="px-3 py-1 text-xs bg-white text-gray-600 rounded-full hover:bg-green-50 hover:text-green-600 transition-all"
                  disabled={loading}
                >
                  Best crops for clay soil
                </button>
                <button
                  type="button"
                  onClick={() => setInput('How to improve soil fertility?')}
                  className="px-3 py-1 text-xs bg-white text-gray-600 rounded-full hover:bg-green-50 hover:text-green-600 transition-all"
                  disabled={loading}
                >
                  Improve soil fertility
                </button>
                <button
                  type="button"
                  onClick={() => setInput('What is crop rotation?')}
                  className="px-3 py-1 text-xs bg-white text-gray-600 rounded-full hover:bg-green-50 hover:text-green-600 transition-all"
                  disabled={loading}
                >
                  Crop rotation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
