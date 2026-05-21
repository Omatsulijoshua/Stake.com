import PlinkoGame from '@/components/games/PlinkoGame';

export default function PlinkoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Plinko</h1>
        <p className="text-gray-400">Watch the ball fall through the pyramid of pins.</p>
      </div>
      
      <PlinkoGame />
    </div>
  );
}
