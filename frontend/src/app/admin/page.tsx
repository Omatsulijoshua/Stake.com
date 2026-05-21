'use client';

import { Users, TrendingUp, Wallet, ShieldAlert, Check, X } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-500' },
  { name: 'Total Bets', value: '$1.2M', icon: TrendingUp, color: 'text-green-500' },
  { name: 'Pending Withdrawals', value: '14', icon: Wallet, color: 'text-orange-500' },
  { name: 'Active Disputes', value: '0', icon: ShieldAlert, color: 'text-red-500' },
];

const pendingWithdrawals = [
  { id: '1', user: '0x123...456', amount: '2.5 ETH', time: '10 mins ago', status: 'PENDING' },
  { id: '2', user: '0x789...012', amount: '150 SOL', time: '25 mins ago', status: 'PENDING' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#1a2c38] p-6 rounded-2xl border border-[#213743]">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={stat.color} size={24} />
              <span className="text-gray-500 text-xs font-bold uppercase">Last 24h</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#1a2c38] rounded-2xl border border-[#213743] overflow-hidden">
          <div className="p-6 border-b border-[#213743] flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Pending Withdrawals</h2>
            <button className="text-primary text-sm font-bold">View All</button>
          </div>
          <div className="p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs font-bold uppercase">
                  <th className="pb-4">User</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Time</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {pendingWithdrawals.map((withdraw) => (
                  <tr key={withdraw.id} className="border-t border-[#213743]">
                    <td className="py-4 text-white font-mono">{withdraw.user}</td>
                    <td className="py-4 text-white font-bold">{withdraw.amount}</td>
                    <td className="py-4 text-gray-400">{withdraw.time}</td>
                    <td className="py-4 text-right space-x-2">
                      <button className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all">
                        <Check size={18} />
                      </button>
                      <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1a2c38] rounded-2xl border border-[#213743] p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ETH Node</span>
              <span className="flex items-center text-accent text-sm font-bold">
                <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">SOL Node</span>
              <span className="flex items-center text-accent text-sm font-bold">
                <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">WebSocket</span>
              <span className="flex items-center text-accent text-sm font-bold">
                <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
                Connected
              </span>
            </div>
          </div>
          <div className="pt-6 border-t border-[#213743]">
             <h3 className="text-white font-bold mb-4">Hot Wallet Balances</h3>
             <div className="space-y-2">
               <div className="flex justify-between bg-[#0f212e] p-3 rounded-lg border border-[#213743]">
                 <span className="text-gray-400">ETH</span>
                 <span className="text-white font-bold">42.56</span>
               </div>
               <div className="flex justify-between bg-[#0f212e] p-3 rounded-lg border border-[#213743]">
                 <span className="text-gray-400">SOL</span>
                 <span className="text-white font-bold">1,240.00</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
