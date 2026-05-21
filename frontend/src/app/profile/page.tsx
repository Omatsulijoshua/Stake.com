'use client';

import { useAuthStore } from '@/store/authStore';
import { User, Wallet, History, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, balance } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-[#1a2c38] p-8 rounded-2xl border border-[#213743] flex items-center space-x-8">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <User size={48} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-white truncate">{user?.walletAddress || '0x...'}</h1>
          <p className="text-gray-400 font-medium">Member since May 2026</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Balance</p>
          <p className="text-3xl font-black text-white">{parseFloat(balance).toFixed(4)} ETH</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-[#1a2c38] rounded-xl border border-[#213743] overflow-hidden">
            <button className="w-full p-4 flex items-center space-x-3 text-white bg-[#213743] font-bold">
              <History size={20} className="text-primary" />
              <span>Bet History</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-[#1a2c38] transition-all font-bold">
              <Wallet size={20} />
              <span>Transactions</span>
            </button>
            <button className="w-full p-4 flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-[#1a2c38] transition-all font-bold">
              <Shield size={20} />
              <span>Security</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-2 bg-[#1a2c38] rounded-2xl border border-[#213743] overflow-hidden">
          <div className="p-6 border-b border-[#213743]">
            <h2 className="text-xl font-bold text-white">Recent Bets</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0f212e] rounded-xl border border-[#213743]">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    <div>
                      <p className="text-white font-bold">Dice</p>
                      <p className="text-gray-500 text-xs">2 mins ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">0.10 ETH</p>
                    <p className="text-accent text-xs font-bold">WON 0.198 ETH</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
