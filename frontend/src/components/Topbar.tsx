import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Wallet, LogIn, User as UserIcon } from 'lucide-react';
import WalletModal from './WalletModal';

export default function Topbar() {
  const { user, balance, logout } = useAuthStore();
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <header className="h-16 bg-[#0f212e] border-b border-[#213743] fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-white tracking-tighter">STAKE<span className="text-primary">.CLONE</span></span>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center bg-[#1a2c38] px-4 py-2 rounded-lg border border-[#213743]">
              <span className="text-white font-bold mr-2">{parseFloat(balance).toFixed(4)}</span>
              <span className="text-gray-400 text-sm">ETH</span>
            </div>
            
            <button 
              onClick={() => setIsWalletOpen(true)}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all"
            >
              <Wallet size={18} />
              <span>Wallet</span>
            </button>

            <button 
              onClick={logout}
              className="w-10 h-10 rounded-full bg-[#213743] flex items-center justify-center text-white hover:bg-[#2a4553] transition-all"
            >
              <UserIcon size={20} />
            </button>
          </>
        ) : (
          <button className="bg-primary hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all">
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>

      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </header>
  );
}
