'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getRarityStyles } from '@/components/skin-helper'; // From previous step

interface Skin {
  id: string;
  name: string;
  rarity: string;
  weapon: string;
  caseId: string | null;
}

export default function Prisma2CasePage({ dbSkins }: { dbSkins: Skin[] }) {
  const [spinning, setSpinning] = useState(false);
  const [reel, setReel] = useState<Skin[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [winner, setWinner] = useState<Skin | null>(null);
  const [showModal, setShowModal] = useState(false);

  const ITEM_WIDTH = 200; 
  const WIN_INDEX = 50; 
  const SPIN_DURATION = 8000;

  const startOpening = () => {
    if (spinning) return;

    // 1. Determine the winner based on weighted odds
    const roll = Math.random() * 100;
    let targetRarity = 'Mil-Spec'; 
    if (roll < 0.26) targetRarity = 'Extraordinary';
    else if (roll < 0.90) targetRarity = 'Covert';
    else if (roll < 4.09) targetRarity = 'Classified';
    else if (roll < 20.07) targetRarity = 'Restricted';

    const pool = dbSkins.filter(s => s.rarity.includes(targetRarity));
    const selectedWinner = pool.length > 0 
      ? pool[Math.floor(Math.random() * pool.length)] 
      : dbSkins[0];

    // 2. Build the visual reel
    const newReel = Array.from({ length: 60 }, () => 
      dbSkins[Math.floor(Math.random() * dbSkins.length)]
    );
    newReel[WIN_INDEX] = selectedWinner;

    setReel(newReel);
    setWinner(selectedWinner);
    setSpinning(true);

    // 3. Calculate Stop Position
    // (Index * Width) - (Half of Viewport) + (Random offset so it's not perfectly centered)
    const viewportCenter = 400; // Assuming 800px width viewport
    const randomJitter = Math.floor(Math.random() * 160) + 20; 
    const stopPosition = (WIN_INDEX * ITEM_WIDTH) - viewportCenter + randomJitter;
    
    setTimeout(() => {
      setTranslateX(stopPosition);
    }, 50);

    // 4. Clean up after spin
    setTimeout(() => {
      setSpinning(false);
      setShowModal(true);
    }, SPIN_DURATION + 500);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white flex flex-col items-center py-20 px-4">
      {/* Case Header */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
          Prisma 2
        </h1>
        <p className="text-yellow-500 font-bold tracking-[0.3em] uppercase text-sm mt-2">Weapon Case</p>
      </div>

      {/* Animation Viewport */}
      <div className="relative w-full max-w-[800px] h-60 bg-[#11141b] border-y border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* The "Center Line" Indicator */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-400 z-20 shadow-[0_0_15px_#eab308]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-400" />
        </div>

        {/* The Moving Reel */}
        <div 
          className="flex h-full transition-transform"
          style={{ 
            transform: `translateX(-${translateX}px)`,
            transitionDuration: `${SPIN_DURATION}ms`,
            transitionTimingFunction: 'cubic-bezier(0.07, 0, 0.05, 1)' 
          }}
        >
          {reel.map((skin, i) => (
            <SkinCard key={`${skin.id}-${i}`} skin={skin} width={ITEM_WIDTH} />
          ))}
        </div>
      </div>

      {/* Control */}
      <button 
        onClick={startOpening}
        disabled={spinning}
        className="mt-16 bg-[#63941c] hover:bg-[#78b122] disabled:bg-gray-800 disabled:text-gray-500 text-white px-16 py-4 rounded-sm font-black text-xl shadow-xl transition-all active:scale-95"
      >
        {spinning ? 'UNSEALING...' : 'OPEN CASE'}
      </button>

      {/* Winning Modal */}
      {showModal && winner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center scale-125">
             <div className="relative group">
                <div className={`absolute inset-0 blur-3xl opacity-30 ${getRarityStyles(winner.rarity).bg}`} />
                <img 
                  src={`/Prisma_2_Case/${winner.name}.jpeg`} 
                  className="w-72 h-72 object-contain relative z-10 mx-auto"
                  alt={winner.name} 
                />
             </div>
             <h2 className="text-4xl font-black mt-6 tracking-tighter uppercase">{winner.weapon}</h2>
             <p className={`text-2xl font-medium ${getRarityStyles(winner.rarity).text}`}>{winner.name}</p>
             <button 
               onClick={() => setShowModal(false)}
               className="mt-10 px-8 py-2 border border-white/20 hover:bg-white/10 transition-colors uppercase text-xs tracking-widest"
             >
               Confirm
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SkinCard({ skin, width }: { skin: Skin; width: number }) {
  const styles = getRarityStyles(skin.rarity);
  
  return (
    <div style={{ width }} className="h-full flex-shrink-0 border-r border-white/5 relative bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="flex flex-col items-center justify-center h-full p-4">
        {/* Mapping to your local path: /Prisma_2_Case/Skin Name.jpeg */}
        <img 
          src={`/Prisma_2_Case/${skin.name}.jpeg`} 
          alt={skin.name}
          className="w-32 h-32 object-contain drop-shadow-2xl"
          onError={(e) => {
            // Fallback if image name doesn't match perfectly
            (e.target as HTMLImageElement).src = '/fallback-skin.png';
          }}
        />
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter truncate w-32 mx-auto">{skin.weapon}</p>
          <p className="text-xs font-bold truncate w-40">{skin.name}</p>
        </div>
      </div>
      {/* Rarity Stripe */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${styles.bg}`} />
    </div>
  );
}