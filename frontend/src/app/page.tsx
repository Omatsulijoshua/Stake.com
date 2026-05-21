import Link from 'next/link';
import { Dice5, Zap, Disc, Grid, Bomb } from 'lucide-react';

const games = [
  {
    name: 'Dice',
    description: 'Predict the number and win big.',
    icon: Dice5,
    path: '/games/dice',
    color: 'bg-blue-600',
    image: '/dice-bg.png' // I'll generate this later
  },
  {
    name: 'Crash',
    description: 'Cash out before the multiplier crashes.',
    icon: Zap,
    path: '/games/crash',
    color: 'bg-orange-600',
    image: '/crash-bg.png'
  },
  {
    name: 'Roulette',
    description: 'Spin the wheel of fortune.',
    icon: Disc,
    path: '/games/roulette',
    color: 'bg-red-600',
    image: '/roulette-bg.png'
  },
  {
    name: 'Plinko',
    description: 'Watch the balls fall and win.',
    icon: Grid,
    path: '/games/plinko',
    color: 'bg-purple-600',
    image: '/plinko-bg.png'
  },
  {
    name: 'Mines',
    description: 'Find gems and avoid bombs.',
    icon: Bomb,
    path: '/games/mines',
    color: 'bg-green-700',
    image: '/mines-bg.png'
  }
];

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">THE FUTURE OF <br />CRYPTO GAMING</h1>
          <p className="text-blue-100 text-lg mb-8">Sign up and start playing the most popular crypto games with instant withdrawals and provably fair results.</p>
          <button className="bg-white text-primary px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-all">
            REGISTER NOW
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <Link key={game.name} href={game.path} className="group">
            <div className={`h-64 rounded-2xl ${game.color} p-8 flex flex-col justify-end relative overflow-hidden transition-all group-hover:-translate-y-2 group-hover:shadow-2xl`}>
              <div className="absolute top-8 right-8 text-white/20 group-hover:text-white/40 transition-colors">
                <game.icon size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white uppercase">{game.name}</h3>
                <p className="text-white/80 font-medium">{game.description}</p>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-[#1a2c38] rounded-2xl p-12 border border-[#213743]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white">LATEST BETS</h2>
          <button className="text-primary font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#0f212e] p-4 rounded-xl border border-[#213743] flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Dice5 size={20} />
                </div>
                <div>
                  <p className="text-white font-bold">Dice</p>
                  <p className="text-gray-500 text-xs">by 0x71C...4921</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">0.45 ETH</p>
                <p className="text-accent text-xs font-bold">2.40x</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
