'use client';

import { useState } from 'react';
import { Users, Gift, TrendingUp, Copy, Check, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const affiliateLink = 'https://stake.clone/?ref=0x123456';

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast.success('Affiliate link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { name: 'Total Referrals', value: '124', icon: Users, color: 'text-blue-500' },
    { name: 'Total Earned', value: '2.45 ETH', icon: DollarSign, color: 'text-green-500' },
    { name: 'Conversion Rate', value: '8.5%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Gift size={40} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Affiliate Program</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Invite your friends and earn a percentage of every bet they make, win or lose!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#1a2c38] p-8 rounded-2xl border border-[#213743] text-center">
            <stat.icon className={`${stat.color} mx-auto mb-4`} size={32} />
            <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
            <p className="text-gray-500 text-sm font-bold uppercase">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a2c38] p-8 rounded-2xl border border-[#213743] space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Affiliate Link</h2>
          <p className="text-gray-400 mb-6">Share this link to start earning commissions instantly.</p>
          
          <div className="flex space-x-4">
            <div className="flex-1 bg-[#0f212e] border border-[#213743] rounded-xl px-6 py-4 text-white font-mono flex items-center overflow-hidden">
              <span className="truncate">{affiliateLink}</span>
            </div>
            <Button onClick={copyLink} className="h-full px-8 bg-primary hover:bg-blue-600 font-bold uppercase">
              {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#213743] grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">How it works</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold mr-3 mt-1">1</div>
                <span>Share your unique link with friends or on social media.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold mr-3 mt-1">2</div>
                <span>Friends sign up and start playing their favorite games.</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold mr-3 mt-1">3</div>
                <span>You receive a 0.5% commission on every wager they place.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#0f212e] p-6 rounded-xl border border-[#213743]">
            <h3 className="text-xl font-bold text-white mb-4">Commission Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-500">Tier 1 (0-10 refs)</span>
                <span className="text-white">0.50%</span>
              </div>
              <div className="w-full bg-[#1a2c38] h-2 rounded-full overflow-hidden">
                 <div className="bg-primary w-full h-full" />
              </div>
              <div className="flex justify-between items-center text-sm font-bold opacity-50">
                <span className="text-gray-500">Tier 2 (10-50 refs)</span>
                <span className="text-white">0.75%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold opacity-50">
                <span className="text-gray-500">Tier 3 (50+ refs)</span>
                <span className="text-white">1.00%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
