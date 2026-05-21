'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap } from 'lucide-react';

const liveBets = [
  { id: 1, user: '0x123...456', game: 'Dice', amount: '0.50 ETH', payout: '1.2x', win: true },
  { id: 2, user: '0x789...012', game: 'Crash', amount: '1.20 SOL', payout: '5.4x', win: true },
  { id: 3, user: '0xabc...def', game: 'Mines', amount: '0.10 ETH', payout: '0.0x', win: false },
  { id: 4, user: '0x456...789', game: 'Roulette', amount: '2.00 SOL', payout: '2.0x', win: true },
  { id: 5, user: '0xdef...123', game: 'Plinko', amount: '0.25 ETH', payout: '0.5x', win: false },
];

export default function LiveStatsTicker() {
  return (
    <div className="bg-[#071119] border-t border-[#213743] h-10 flex items-center overflow-hidden fixed bottom-0 left-0 right-0 z-[45] lg:left-64">
      <div className="bg-primary px-4 h-full flex items-center space-x-2 z-10">
        <Zap size={14} className="text-white fill-current" />
        <span className="text-white text-[10px] font-black uppercase tracking-widest">Live Activity</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center space-x-8 whitespace-nowrap px-4"
        >
          {[...liveBets, ...liveBets, ...liveBets].map((bet, i) => (
            <div key={i} className="flex items-center space-x-2 text-[11px] font-bold">
              <span className="text-gray-500 font-mono">{bet.user}</span>
              <span className="text-gray-400">played</span>
              <span className="text-white">{bet.game}</span>
              <span className="text-gray-400">for</span>
              <span className="text-white">{bet.amount}</span>
              <span className={`px-1.5 py-0.5 rounded ${bet.win ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'}`}>
                {bet.win ? `Won ${bet.payout}` : 'Lost'}
              </span>
            </div>
          ))}
        </motion.div>
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#071119] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#071119] to-transparent z-10" />
      </div>

      <div className="bg-[#1a2c38] px-4 h-full flex items-center space-x-4 border-l border-[#213743] hidden md:flex">
         <div className="flex items-center space-x-1.5">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-gray-400 text-[10px] font-bold uppercase">Wagered:</span>
            <span className="text-white text-[10px] font-black">1,452 ETH</span>
         </div>
         <div className="flex items-center space-x-1.5">
            <Award size={14} className="text-primary" />
            <span className="text-gray-400 text-[10px] font-bold uppercase">Wins:</span>
            <span className="text-white text-[10px] font-black">892 ETH</span>
         </div>
      </div>
    </div>
  );
}
