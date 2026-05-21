import MinesGame from '@/components/games/MinesGame';

export default function MinesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Mines</h1>
        <p className="text-gray-400">Reveal gems and avoid the mines to increase your multiplier.</p>
      </div>
      
      <MinesGame />
    </div>
  );
}
