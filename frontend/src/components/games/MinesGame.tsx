'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bomb, Gem, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function MinesGame() {
  const [minesCount, setMinesCount] = useState(3);
  const [betAmount, setBetAmount] = useState('10.00');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [tiles, setTiles] = useState<any[]>(Array(25).fill({ revealed: false, type: 'empty' }));
  const [revealedCount, setRevealedCount] = useState(0);
  const [isCashedOut, setIsCashedOut] = useState(false);

  const calculateMultiplier = (revealed: number) => {
    // Basic Mines multiplier logic
    if (revealed === 0) return 1.0;
    let mult = 1.0;
    for (let i = 0; i < revealed; i++) {
      mult *= (25 - i) / (25 - i - minesCount);
    }
    return mult.toFixed(2);
  };

  const startGame = () => {
    setGameState('playing');
    setIsCashedOut(false);
    setRevealedCount(0);
    
    // Randomly place mines
    const newTiles = Array(25).fill(null).map(() => ({ revealed: false, type: 'gem' }));
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
      const idx = Math.floor(Math.random() * 25);
      if (newTiles[idx].type === 'gem') {
        newTiles[idx].type = 'mine';
        minesPlaced++;
      }
    }
    setTiles(newTiles);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || tiles[index].revealed) return;

    const newTiles = [...tiles];
    newTiles[index].revealed = true;
    setTiles(newTiles);

    if (newTiles[index].type === 'mine') {
      setGameState('ended');
      toast.error('KABOOM! You hit a mine.');
    } else {
      const newCount = revealedCount + 1;
      setRevealedCount(newCount);
      toast.success(`Gem found! Multiplier: ${calculateMultiplier(newCount)}x`);
      
      if (newCount === 25 - minesCount) {
        handleCashout();
      }
    }
  };

  const handleCashout = () => {
    setGameState('ended');
    setIsCashedOut(true);
    const winAmount = parseFloat(betAmount) * parseFloat(calculateMultiplier(revealedCount));
    toast.success(`Cashed out! You won ${winAmount.toFixed(2)} ETH`);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743] space-y-6">
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block uppercase">Bet Amount</label>
          <Input 
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            disabled={gameState === 'playing'}
            className="bg-[#0f212e] border-[#213743] text-white font-bold h-12"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block uppercase">Mines</label>
          <select 
            value={minesCount}
            onChange={(e) => setMinesCount(parseInt(e.target.value))}
            disabled={gameState === 'playing'}
            className="w-full bg-[#0f212e] border border-[#213743] rounded-lg h-12 px-4 text-white font-bold appearance-none outline-none focus:border-primary"
          >
            {[1, 3, 5, 10, 24].map((n) => (
              <option key={n} value={n}>{n} Mines</option>
            ))}
          </select>
        </div>

        {gameState === 'playing' ? (
          <Button 
            onClick={handleCashout}
            className="w-full bg-accent hover:bg-green-600 text-black font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#00a001]"
          >
            CASHOUT ({(parseFloat(betAmount) * parseFloat(calculateMultiplier(revealedCount))).toFixed(2)})
          </Button>
        ) : (
          <Button 
            onClick={startGame}
            className="w-full bg-primary hover:bg-blue-600 text-white font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#0a5db5]"
          >
            BET
          </Button>
        )}

        <div className="bg-[#0f212e] p-4 rounded-xl space-y-2 border border-[#213743]">
           <div className="flex justify-between text-xs font-bold">
             <span className="text-gray-500">Mines</span>
             <span className="text-white">{minesCount}</span>
           </div>
           <div className="flex justify-between text-xs font-bold">
             <span className="text-gray-500">Gems</span>
             <span className="text-white">{25 - minesCount}</span>
           </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-[#1a2c38] p-8 rounded-xl border border-[#213743] flex items-center justify-center">
        <div className="grid grid-cols-5 gap-3 w-full max-w-[400px]">
          {tiles.map((tile, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTileClick(i)}
              disabled={gameState !== 'playing' || tile.revealed}
              className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                tile.revealed 
                  ? tile.type === 'mine' ? 'bg-danger/20 border-2 border-danger' : 'bg-accent/20 border-2 border-accent'
                  : 'bg-[#213743] hover:bg-[#2a4553] shadow-[0_4px_0_0_#0f212e]'
              }`}
            >
              <AnimatePresence>
                {tile.revealed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={tile.type === 'mine' ? 'text-danger' : 'text-accent'}
                  >
                    {tile.type === 'mine' ? <Bomb size={24} /> : <Gem size={24} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
