import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { sendMessageToBot } from '../services/geminiService';
import { SendHorizonal, Bot, User, AlertCircle, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LawBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const CHAT_HISTORY_KEY = 'lawBotChatHistory';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
    
  useEffect(() => {
    // Load chat history from localStorage on component mount
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
      setError("There was an issue loading your chat history from this device. Your conversation will start fresh for this session.");
    }
    
    // If no history, show initial loading and welcome message
    setIsLoading(true);
    setTimeout(() => {
        setMessages([{ sender: 'bot', text: 'Hello! I am LawBot. How can I help you understand your rights and responsibilities as a citizen today?' }]);
        setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Save chat history to localStorage whenever messages change
    if (messages.length > 0) {
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history to localStorage", e);
        setError("Warning: We couldn't save your latest message to this device. Your chat history might not be up-to-date if you refresh the page.");
      }
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    setError(null); // Clear previous errors on new submission

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponse = await sendMessageToBot(input);
    
    // The geminiService returns a specific string on error. We can use this to show a more prominent error.
    if (botResponse.includes("I'm sorry, I'm having trouble connecting right now")) {
        setError("The AI service seems to be unavailable. Please try again in a few moments.");
    }
    
    const botMessage: ChatMessage = { sender: 'bot', text: botResponse };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col h-[60vh]">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">LawBot Assistant</h3>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-3 rounded-md mb-4 text-sm flex items-start animate-fade-in" role="alert">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4">
        {isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                <Loader className="h-8 w-8 animate-spin text-primary-500" />
                <p className="mt-2 text-sm">Loading chat history...</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="bg-primary-100 rounded-full p-2">
                <Bot className="h-5 w-5 text-primary-600" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
               <ReactMarkdown className="prose prose-sm max-w-none prose-gray">{msg.text}</ReactMarkdown>
            </div>
             {msg.sender === 'user' && (
              <div className="bg-gray-200 rounded-full p-2">
                <User className="h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages.length > 0 && (
            <div className="flex items-start gap-3 animate-fade-in">
                <div className="bg-primary-100 rounded-full p-2">
                    <Bot className="h-5 w-5 text-primary-600" />
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-3 flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-primary-500" />
                    <span className="text-sm text-gray-600">LawBot is typing...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition duration-200 text-gray-900 disabled:bg-gray-200"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
        >
          Send
          <SendHorizonal className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default LawBot;