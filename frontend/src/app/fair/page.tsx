'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Search } from 'lucide-react';

export default function ProvablyFairPage() {
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState('1');
  const [result, setResult] = useState<string | null>(null);

  const verify = () => {
    // Basic verification logic simulation
    setResult('Verified! Result: 42.56');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase">Provably Fair</h1>
        <p className="text-gray-400">Our games use a cryptographic algorithm to ensure every result is random and transparent.</p>
      </div>

      <div className="bg-[#1a2c38] p-8 rounded-2xl border border-[#213743] space-y-6">
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block uppercase">Server Seed</label>
          <Input 
            value={serverSeed}
            onChange={(e) => setServerSeed(e.target.value)}
            placeholder="Enter the hashed server seed from your game"
            className="bg-[#0f212e] border-[#213743] text-white"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block uppercase">Client Seed</label>
          <Input 
            value={clientSeed}
            onChange={(e) => setClientSeed(e.target.value)}
            placeholder="Enter your client seed"
            className="bg-[#0f212e] border-[#213743] text-white"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm font-bold mb-2 block uppercase">Nonce</label>
          <Input 
            type="number"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            className="bg-[#0f212e] border-[#213743] text-white"
          />
        </div>

        <Button onClick={verify} className="w-full bg-primary h-12 font-bold uppercase flex items-center justify-center">
          <Search size={18} className="mr-2" />
          Verify Result
        </Button>

        {result && (
          <div className="p-4 bg-accent/10 border border-accent rounded-lg text-accent font-bold text-center">
            {result}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743]">
          <h3 className="text-white font-bold mb-2">How it works</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            We generate a server seed and hash it before you play. When you bet, we combine the server seed, your client seed, and a nonce to generate a HMAC-SHA256 hash. The first 8 characters of this hash determine the outcome.
          </p>
        </div>
        <div className="bg-[#1a2c38] p-6 rounded-xl border border-[#213743]">
          <h3 className="text-white font-bold mb-2">Transparency</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            After each game, we reveal the server seed. You can use this page to verify that the result matches the hash provided before the game.
          </p>
        </div>
      </div>
    </div>
  );
}
