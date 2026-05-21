'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Copy, Check, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [currency, setCurrency] = useState<'ETH' | 'SOL'>('ETH');
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const { balance } = useAuthStore();

  const depositAddress = currency === 'ETH' ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' : '6p67mS7W7aVjFmFz9t1S...';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1a2c38] w-full max-w-md rounded-2xl border border-[#213743] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#213743]">
          <h2 className="text-xl font-black text-white uppercase flex items-center">
            <span className="bg-primary/20 p-2 rounded-lg mr-3 text-primary">
              <ArrowDownCircle size={20} />
            </span>
            Wallet
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex p-1 bg-[#0f212e] m-6 rounded-xl border border-[#213743]">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${activeTab === 'deposit' ? 'bg-[#213743] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Deposit
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${activeTab === 'withdraw' ? 'bg-[#213743] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Withdraw
          </button>
        </div>

        <div className="px-6 pb-8 space-y-6">
          <div className="flex space-x-2">
            {['ETH', 'SOL'].map((curr) => (
              <button 
                key={curr}
                onClick={() => setCurrency(curr as any)}
                className={`flex-1 p-3 rounded-lg border font-bold transition-all ${currency === curr ? 'border-primary bg-primary/10 text-white' : 'border-[#213743] text-gray-400 hover:bg-[#213743]'}`}
              >
                {curr}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'deposit' ? (
              <motion.div 
                key="deposit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-[#0f212e] p-6 rounded-2xl flex flex-col items-center border border-[#213743]">
                  {/* Placeholder QR Code */}
                  <div className="w-40 h-40 bg-white p-2 rounded-lg mb-4 flex items-center justify-center">
                     <div className="w-full h-full border-4 border-black grid grid-cols-4 grid-rows-4 gap-1 opacity-20">
                        {Array.from({length: 16}).map((_, i) => <div key={i} className="bg-black" />)}
                     </div>
                  </div>
                  <p className="text-gray-400 text-xs text-center px-4">Only send {currency} to this address. Sending other assets will result in permanent loss.</p>
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase mb-2 block">Your {currency} Deposit Address</label>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-[#0f212e] border border-[#213743] rounded-lg px-4 py-3 text-white text-sm font-mono truncate">
                      {depositAddress}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="bg-primary p-3 rounded-lg text-white hover:bg-blue-600 transition-all"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="withdraw"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase mb-2 block">{currency} Address</label>
                  <Input 
                    placeholder="Enter destination address"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="bg-[#0f212e] border-[#213743] text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-bold uppercase mb-2 block">Amount</label>
                  <div className="relative">
                    <Input 
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-[#0f212e] border-[#213743] text-white"
                    />
                    <div className="absolute right-3 top-3 text-xs font-bold text-gray-500">
                      Balance: {balance}
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-primary h-12 font-bold uppercase mt-4">
                  Request Withdrawal
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
