'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSound } from '@/hooks/useSound';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dice5, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiceGame() {
  const { playSound } = useSound();
  const [amount, setAmount] = useState('10.00');
  const [target, setTarget] = useState(50);
  const [condition, setCondition] = useState<'over' | 'under'>('over');
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const { balance, setBalance } = useAuthStore();

  const winChance = condition === 'over' ? 100 - target : target;
  const multiplier = winChance > 0 ? (99 / winChance).toFixed(4) : '0.00';

  const handleRoll = async () => {
    if (isRolling) return;
    setIsRolling(true);
    playSound('spin');
    setResult(null);
    
    // Simulate API call
    setTimeout(() => {
      const roll = Math.random() * 100;
      setResult(roll);
      setIsRolling(false);
      
      const isWin = condition === 'over' ? roll > target : roll < target;
      if (isWin) {
        playSound('win');
        // Update balance logic here
      } else {
        playSound('lose');
      }
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743] space-y-6">
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block">Bet Amount</label>
          <div className="relative">
            <Input 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#0f212e] border-[#213743] text-white font-bold h-12"
            />
            <div className="absolute right-2 top-2 flex space-y-0.5">
              <button className="bg-[#213743] px-2 py-1 text-xs text-white rounded hover:bg-[#2a4553]">1/2</button>
              <button className="bg-[#213743] px-2 py-1 text-xs text-white rounded ml-1 hover:bg-[#2a4553]">x2</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setCondition('under')}
            className={`py-3 rounded-lg font-bold transition-all ${condition === 'under' ? 'bg-primary text-white' : 'bg-[#0f212e] text-gray-400 border border-[#213743]'}`}
          >
            Roll Under
          </button>
          <button 
            onClick={() => setCondition('over')}
            className={`py-3 rounded-lg font-bold transition-all ${condition === 'over' ? 'bg-primary text-white' : 'bg-[#0f212e] text-gray-400 border border-[#213743]'}`}
          >
            Roll Over
          </button>
        </div>

        <Button 
          onClick={handleRoll}
          disabled={isRolling}
          className="w-full bg-accent hover:bg-green-600 text-black font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#00a001]"
        >
          {isRolling ? <RefreshCw className="animate-spin mr-2" /> : <Dice5 className="mr-2" />}
          BET
        </Button>
      </div>

      {/* Game Display */}
      <div className="md:col-span-2 bg-[#1a2c38] p-8 rounded-xl border border-[#213743] flex flex-col justify-center relative overflow-hidden">
        <div className="mb-12">
          <div className="h-4 bg-[#0f212e] rounded-full relative overflow-hidden">
            <div 
              className="absolute h-full bg-primary transition-all duration-300"
              style={{ 
                left: condition === 'under' ? '0' : `${target}%`,
                right: condition === 'under' ? `${100 - target}%` : '0'
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-gray-500 font-bold text-sm">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        <div className="flex justify-center items-center h-48">
          <AnimatePresence mode="wait">
            {result !== null && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className={`text-7xl font-black ${
                  (condition === 'over' ? result > target : result < target) ? 'text-accent' : 'text-danger'
                }`}
              >
                {result.toFixed(2)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-auto">
          <div className="bg-[#0f212e] p-3 rounded-lg text-center">
            <p className="text-gray-500 text-xs font-bold uppercase">Multiplier</p>
            <p className="text-white font-black">{multiplier}x</p>
          </div>
          <div className="bg-[#0f212e] p-3 rounded-lg text-center">
            <p className="text-gray-500 text-xs font-bold uppercase">Win Chance</p>
            <p className="text-white font-black">{winChance.toFixed(2)}%</p>
          </div>
          <div className="bg-[#0f212e] p-3 rounded-lg text-center">
            <p className="text-gray-500 text-xs font-bold uppercase">Payout</p>
            <p className="text-accent font-black">
              {(parseFloat(amount) * parseFloat(multiplier)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
