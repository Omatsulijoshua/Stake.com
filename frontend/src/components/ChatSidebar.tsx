'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
}

export default function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'CryptoKing', text: 'Just hit a 10x on Crash! 🚀', time: '12:01' },
    { id: '2', user: 'StakeFan', text: 'Nice one! I am struggling with Dice today.', time: '12:02' },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 bottom-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        className="fixed right-0 top-16 bottom-0 w-80 bg-[#1a2c38] border-l border-[#213743] flex flex-col z-40 shadow-2xl"
      >
        <div className="p-4 border-b border-[#213743] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users size={18} className="text-gray-400" />
            <span className="text-white font-bold uppercase tracking-wider text-sm">Community Chat</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#213743]"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className={`text-xs font-black ${msg.user === 'You' ? 'text-primary' : 'text-gray-500'}`}>
                  {msg.user}
                </span>
                <span className="text-[10px] text-gray-600">{msg.time}</span>
              </div>
              <div className={`p-3 rounded-xl text-sm ${msg.user === 'You' ? 'bg-primary/10 text-white border border-primary/20' : 'bg-[#0f212e] text-gray-300 border border-[#213743]'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-[#0f212e] border-t border-[#213743]">
          <div className="relative">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-[#1a2c38] border border-[#213743] rounded-lg px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 p-1.5 text-primary hover:text-blue-400 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </motion.aside>
    </>
  );
}
