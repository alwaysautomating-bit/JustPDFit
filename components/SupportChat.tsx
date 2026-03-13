
import React, { useState, useRef, useEffect } from 'react';
import { createSupportChat } from '../services/chatService';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello. I am the JustPDFIt assistant.\nHow can I assist with your document transformation today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = () => {
    if (!chatInstance.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      chatInstance.current = createSupportChat(ai);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      initChat();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      initChat();

      const responseStream = await chatInstance.current.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const chunkResponse = chunk as GenerateContentResponse;
        fullText += chunkResponse.text || '';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Please upload a document to begin.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-gray-100"
          >
            <div className="bg-[#111827] p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">Support Assistant</h3>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">Enterprise Agent Active</p>
                </div>
              </div>
              <button onClick={toggleChat} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.role === 'user' 
                    ? 'bg-[#111827] text-white rounded-br-none' 
                    : 'bg-white text-[#111827] border border-gray-100 rounded-bl-none'
                  }`}>
                    {m.text || (isLoading && i === messages.length - 1 ? '...' : '')}
                  </div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 text-sm focus:outline-none placeholder-gray-400"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="p-2 text-gray-400 hover:text-[#111827] transition-colors disabled:opacity-30"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${
          isOpen ? 'bg-gray-100 text-[#111827]' : 'bg-[#111827] text-white'
        }`}
      >
        {isOpen ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
