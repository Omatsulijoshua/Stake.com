import RouletteGame from '@/components/games/RouletteGame';

export default function RoulettePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Roulette</h1>
        <p className="text-gray-400">Classic European roulette. Place your bets.</p>
      </div>
      
      <RouletteGame />
    </div>
  );
}
