'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Dice5, Zap, Disc, Wallet, ShieldCheck, Users, Grid, Bomb, Menu, X, Gift } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Dice', icon: Dice5, path: '/games/dice' },
  { name: 'Crash', icon: Zap, path: '/games/crash' },
  { name: 'Roulette', icon: Disc, path: '/games/roulette' },
  { name: 'Plinko', icon: Grid, path: '/games/plinko' },
  { name: 'Mines', icon: Bomb, path: '/games/mines' },
];

const adminItems = [
  { name: 'Dashboard', icon: Users, path: '/admin' },
  { name: 'Withdrawals', icon: Wallet, path: '/admin/withdrawals' },
  { name: 'Affiliate', icon: Gift, path: '/affiliate' },
  { name: 'Provably Fair', icon: ShieldCheck, path: '/fair' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Games</p>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.path ? 'bg-[#213743] text-white' : 'text-gray-400 hover:bg-[#1a2c38] hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}

        <div className="pt-8">
          <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">Other</p>
          {adminItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path ? 'bg-[#213743] text-white' : 'text-gray-400 hover:bg-[#1a2c38] hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-[60] p-4 bg-primary text-white rounded-full shadow-2xl lg:hidden border border-white/10"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0f212e] border-r border-[#213743] h-screen fixed left-0 top-0 pt-16 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[55] w-72 bg-[#0f212e] border-r border-[#213743] pt-20 lg:hidden shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
