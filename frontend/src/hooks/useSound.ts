'use client';

import { useCallback } from 'react';

type SoundType = 'click' | 'win' | 'lose' | 'spin' | 'crash' | 'drop';

export const useSound = () => {
  const playSound = useCallback((type: SoundType) => {
    // In production, load actual audio files
    // const audio = new Audio(`/sounds/${type}.mp3`);
    // audio.volume = 0.5;
    // audio.play().catch(() => {});
    
    console.log(`[Sound System] Playing: ${type}`);
  }, []);

  return { playSound };
};
