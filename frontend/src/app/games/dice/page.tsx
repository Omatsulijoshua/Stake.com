import DiceGame from '@/components/games/DiceGame';

export default function DicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Dice</h1>
        <p className="text-gray-400">Classic crypto dice game. Provably fair.</p>
      </div>
      
      <DiceGame />

      <div className="bg-[#1a2c38] rounded-xl border border-[#213743] overflow-hidden mt-12">
        <div className="bg-[#213743] px-6 py-3 flex space-x-6 text-sm font-bold text-gray-400">
          <button className="text-white border-b-2 border-primary pb-1">All Bets</button>
          <button className="hover:text-white pb-1">My Bets</button>
          <button className="hover:text-white pb-1">High Rollers</button>
        </div>
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs font-bold uppercase">
                <th className="pb-4">Game</th>
                <th className="pb-4">User</th>
                <th className="pb-4">Time</th>
                <th className="pb-4">Bet Amount</th>
                <th className="pb-4">Multiplier</th>
                <th className="pb-4 text-right">Payout</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-t border-[#213743]">
                <td className="py-4 text-white">Dice</td>
                <td className="py-4 text-gray-400">0x1234...5678</td>
                <td className="py-4 text-gray-400">14:50</td>
                <td className="py-4 text-white">10.00 ETH</td>
                <td className="py-4 text-white">2.00x</td>
                <td className="py-4 text-accent text-right">+20.00 ETH</td>
              </tr>
              {/* More rows... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
