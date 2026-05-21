'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, RotateCcw } from 'lucide-react';

const ROWS = 16;
const MULTIPLIERS = [16, 9, 2, 1.4, 1, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 1, 1.4, 2, 9, 16];

export default function PlinkoGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [balls, setBalls] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  const dropBall = () => {
    const newBall = {
      x: 400,
      y: 50,
      vx: 0,
      vy: 0,
      row: 0,
      path: [],
      id: Date.now()
    };
    setBalls((prev) => [...prev, newBall]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Pins
      ctx.fillStyle = '#213743';
      for (let r = 0; r < ROWS; r++) {
        const pinCount = r + 3;
        const spacing = 40;
        const rowWidth = (pinCount - 1) * spacing;
        const startX = (canvas.width - rowWidth) / 2;
        
        for (let i = 0; i < pinCount; i++) {
          ctx.beginPath();
          ctx.arc(startX + i * spacing, 100 + r * 40, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Multipliers
      MULTIPLIERS.forEach((m, i) => {
        const spacing = 40;
        const startX = (canvas.width - (MULTIPLIERS.length - 1) * spacing) / 2;
        ctx.fillStyle = m >= 1 ? '#00e701' : '#ff4b4b';
        ctx.fillRect(startX + i * spacing - 15, canvas.height - 60, 30, 20);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${m}x`, startX + i * spacing, canvas.height - 46);
      });

      // Update and Draw Balls
      setBalls((prev) => {
        return prev.map((ball) => {
          if (ball.y > canvas.height - 80) return null; // Remove ball
          
          let nextY = ball.y + 3;
          let nextX = ball.x;
          
          // Basic physics simulation: at each row, go left or right
          const currentRow = Math.floor((ball.y - 100) / 40);
          if (currentRow > ball.row && currentRow < ROWS) {
            const direction = Math.random() > 0.5 ? 1 : -1;
            nextX += direction * 20;
            return { ...ball, x: nextX, y: nextY, row: currentRow };
          }
          
          return { ...ball, y: nextY };
        }).filter(Boolean);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743] space-y-6">
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block uppercase">Bet Amount</label>
          <Input 
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bg-[#0f212e] border-[#213743] text-white font-bold"
          />
        </div>
        <Button 
          onClick={dropBall}
          className="w-full bg-accent hover:bg-green-600 text-black font-black h-14 text-lg rounded-xl shadow-[0_4px_0_0_#00a001]"
        >
          <Play size={20} className="mr-2" />
          BET
        </Button>
      </div>

      <div className="md:col-span-3 bg-[#1a2c38] p-8 rounded-xl border border-[#213743] relative min-h-[700px] flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={750} 
          className="w-full h-full"
        />
        
        {balls.map((ball) => (
          <motion.div
            key={ball.id}
            style={{ 
              position: 'absolute',
              left: ball.x,
              top: ball.y,
              width: 12,
              height: 12,
              backgroundColor: '#1475e1',
              borderRadius: '50%',
              boxShadow: '0 0 10px #1475e1',
              transform: 'translate(-50%, -50%)',
              zIndex: 20
            }}
          />
        ))}
      </div>
    </div>
  );
}
