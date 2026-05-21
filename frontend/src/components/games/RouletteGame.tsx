'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Disc, RefreshCw } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export default function RouletteGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [selectedBet, setSelectedBet] = useState<string | number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const controls = useAnimation();

  const handleSpin = async () => {
    if (isSpinning || selectedBet === null) return;
    setIsSpinning(true);
    setResult(null);

    const winningIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length);
    const winningNumber = ROULETTE_NUMBERS[winningIndex];
    
    // Rotate 5 full circles + the offset to the winning number
    const degreesPerNumber = 360 / ROULETTE_NUMBERS.length;
    const finalRotation = 360 * 5 + (360 - winningIndex * degreesPerNumber);

    await controls.start({
      rotate: finalRotation,
      transition: { duration: 4, ease: [0.12, 0, 0.39, 0] }
    });

    setResult(winningNumber);
    setIsSpinning(false);
    
    // Reset rotation for next spin (without animation)
    controls.set({ rotate: finalRotation % 360 });
  };

  const isRed = (num: number) => [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex flex-col items-center justify-center space-y-8 py-12 bg-[#1a2c38] rounded-2xl border border-[#213743] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-primary z-10 shadow-[0_0_15px_rgba(20,117,225,0.8)]" />
        
        <motion.div 
          animate={controls}
          className="w-80 h-80 rounded-full border-8 border-[#213743] relative shadow-2xl flex items-center justify-center overflow-hidden bg-[#0f212e]"
        >
          {ROULETTE_NUMBERS.map((num, i) => (
            <div 
              key={i}
              className="absolute h-full w-4 origin-bottom flex flex-col items-center pt-2"
              style={{ 
                transform: `rotate(${i * (360 / ROULETTE_NUMBERS.length)}deg)`,
                bottom: '50%'
              }}
            >
              <span className={`text-[10px] font-bold ${num === 0 ? 'text-accent' : isRed(num) ? 'text-danger' : 'text-white'}`}>
                {num}
              </span>
            </div>
          ))}
          <div className="w-64 h-64 rounded-full border-4 border-[#213743] bg-[#1a2c38] flex items-center justify-center shadow-inner">
             <Disc size={60} className="text-[#213743]" />
          </div>
        </motion.div>

        {result !== null && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-5xl font-black ${result === 0 ? 'text-accent' : isRed(result) ? 'text-danger' : 'text-white'}`}
          >
            {result}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743] space-y-6">
          <div>
            <label className="text-gray-400 text-sm font-bold mb-2 block">Bet Amount</label>
            <Input 
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-[#0f212e] border-[#213743] text-white font-bold h-12"
            />
          </div>
          <Button 
            onClick={handleSpin}
            disabled={isSpinning || selectedBet === null}
            className="w-full bg-primary hover:bg-blue-600 text-white font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#0a5db5]"
          >
            {isSpinning ? <RefreshCw className="animate-spin mr-2" /> : 'SPIN'}
          </Button>
        </div>

        <div className="lg:col-span-3 bg-[#1a2c38] p-6 rounded-xl border border-[#213743]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setSelectedBet('red')}
              className={`p-6 rounded-xl border-2 font-black text-xl transition-all ${selectedBet === 'red' ? 'border-primary bg-danger/20 text-danger' : 'border-[#213743] text-danger hover:bg-danger/5'}`}
            >
              RED (2x)
            </button>
            <button 
              onClick={() => setSelectedBet('black')}
              className={`p-6 rounded-xl border-2 font-black text-xl transition-all ${selectedBet === 'black' ? 'border-primary bg-white/5 text-white' : 'border-[#213743] text-white hover:bg-white/5'}`}
            >
              BLACK (2x)
            </button>
            <button 
              onClick={() => setSelectedBet('green')}
              className={`p-6 rounded-xl border-2 font-black text-xl transition-all ${selectedBet === 'green' ? 'border-primary bg-accent/20 text-accent' : 'border-[#213743] text-accent hover:bg-accent/5'}`}
            >
              0 (14x)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
