import CrashGame from '@/components/games/CrashGame';

export default function CrashPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Crash</h1>
          <p className="text-gray-400">Cash out before the multiplier goes boom.</p>
        </div>
      </div>
      
      <CrashGame />

      <div className="bg-[#1a2c38] rounded-xl border border-[#213743] overflow-hidden mt-12">
        <div className="bg-[#213743] px-6 py-3 flex space-x-6 text-sm font-bold text-gray-400 border-b border-[#213743]">
          <button className="text-white border-b-2 border-primary pb-1">All Bets</button>
          <button className="hover:text-white pb-1">My Bets</button>
        </div>
        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs font-bold uppercase">
                <th className="pb-4">User</th>
                <th className="pb-4">Multiplier</th>
                <th className="pb-4">Bet Amount</th>
                <th className="pb-4 text-right">Payout</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-t border-[#213743]">
                  <td className="py-4 text-gray-400">0x82...{i}293</td>
                  <td className="py-4 text-white">1.{i}5x</td>
                  <td className="py-4 text-white">0.50 ETH</td>
                  <td className="py-4 text-accent text-right">+0.{(50 * (1 + 0.1 * i)).toFixed(0)} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
