'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CrashGame() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [betAmount, setBetAmount] = useState('10.00');
  const [hasCasheout, setHasCasheout] = useState(false);
  const [cashedOutAt, setCashedOutAt] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  const startNewRound = () => {
    setIsGameRunning(true);
    setIsCrashed(false);
    setMultiplier(1.00);
    setHasCasheout(false);
    setCashedOutAt(null);
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  const animate = () => {
    if (!startTimeRef.current) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newMultiplier = Math.pow(1.06, elapsed * 10); // Exponential growth
    
    // Simulate crash at 2.5x for demo
    if (newMultiplier > 2.5) {
      setIsCrashed(true);
      setIsGameRunning(false);
      cancelAnimationFrame(requestRef.current!);
      return;
    }

    setMultiplier(newMultiplier);
    drawChart(newMultiplier, elapsed);
    requestRef.current = requestAnimationFrame(animate);
  };

  const drawChart = (mult: number, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1475e1';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    // Draw an exponential curve
    ctx.moveTo(50, canvas.height - 50);
    for (let i = 0; i < time * 10; i++) {
      const x = 50 + (i * (canvas.width - 100) / (time * 10));
      const y = (canvas.height - 50) - (Math.pow(1.06, i) * 10);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const handleCashout = () => {
    if (!isGameRunning || hasCasheout) return;
    setHasCasheout(true);
    setCashedOutAt(multiplier);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743] space-y-6">
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block">Bet Amount</label>
          <Input 
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bg-[#0f212e] border-[#213743] text-white font-bold h-12"
          />
        </div>

        {isGameRunning && !hasCasheout ? (
          <Button 
            onClick={handleCashout}
            className="w-full bg-accent hover:bg-green-600 text-black font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#00a001]"
          >
            CASHOUT ({(parseFloat(betAmount) * multiplier).toFixed(2)})
          </Button>
        ) : (
          <Button 
            onClick={startNewRound}
            disabled={isGameRunning}
            className="w-full bg-primary hover:bg-blue-600 text-white font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#0a5db5]"
          >
            BET
          </Button>
        )}

        {hasCasheout && (
          <div className="bg-accent/10 border border-accent p-4 rounded-lg text-center">
            <p className="text-accent font-bold">CASHED OUT!</p>
            <p className="text-white text-2xl font-black">{cashedOutAt?.toFixed(2)}x</p>
            <p className="text-accent text-sm">+{(parseFloat(betAmount) * (cashedOutAt! - 1)).toFixed(2)} ETH</p>
          </div>
        )}
      </div>

      <div className="md:col-span-3 bg-[#1a2c38] p-8 rounded-xl border border-[#213743] relative min-h-[400px] flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="absolute inset-0 w-full h-full"
        />
        
        <div className="relative z-10 text-center">
          <motion.h2 
            key={isCrashed ? 'crashed' : 'running'}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-8xl font-black tracking-tighter ${isCrashed ? 'text-danger' : 'text-white'}`}
          >
            {multiplier.toFixed(2)}x
          </motion.h2>
          {isCrashed && (
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-danger text-2xl font-bold mt-4 uppercase"
            >
              Crashed!
            </motion.p>
          )}
        </div>

        <div className="absolute bottom-6 left-6 flex space-x-2">
          {[1.2, 2.5, 1.05, 14.2, 1.8].map((m, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold ${m > 2 ? 'bg-accent text-black' : 'bg-[#0f212e] text-gray-400'}`}>
              {m.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
