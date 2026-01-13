'use client';

import React, { useState, useRef, useEffect } from 'react';

// --- Types ---
export interface Skin {
    id: string;
    name: string;
    rarity: string;
    weapon: string;
    caseId: string | null;
}

// --- Helper Logic ---
const getRarityStyles = (rarity: string) => {
    const r = rarity.toLowerCase();
    if (r.includes('covert')) return { bg: 'bg-[#eb4b4b]', text: 'text-[#eb4b4b]', border: 'border-[#eb4b4b]' };
    if (r.includes('classified')) return { bg: 'bg-[#d32ee6]', text: 'text-[#d32ee6]', border: 'border-[#d32ee6]' };
    if (r.includes('restricted')) return { bg: 'bg-[#8847ff]', text: 'text-[#8847ff]', border: 'border-[#8847ff]' };
    if (r.includes('mil-spec')) return { bg: 'bg-[#4b69ff]', text: 'text-[#4b69ff]', border: 'border-[#4b69ff]' };
    if (r.includes('extraordinary')) return { bg: 'bg-[#e4ae39]', text: 'text-[#e4ae39]', border: 'border-[#e4ae39]' };
    return { bg: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500' };
};

// --- Constants ---
const ITEM_WIDTH = 200; // px
const WIN_INDEX = 50;   // Item position
const SPIN_DURATION = 8000; // ms


export default function CaseOpening({ dbSkins, caseName }: { dbSkins: Skin[], caseName: string }) {
    const [spinning, setSpinning] = useState(false);
    const [reel, setReel] = useState<Skin[]>([]);
    const [translateX, setTranslateX] = useState(0);
    const [duration, setDuration] = useState(0);
    const [winner, setWinner] = useState<Skin | null>(null);
    const [showModal, setShowModal] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const audioTick = useRef<HTMLAudioElement | null>(null);

    // 1. Generate the initial reel (shuffled)
    useEffect(() => {
        console.log('CaseOpening received skins:', dbSkins.length);
        if (dbSkins.length > 0) {
            const initial = Array.from({ length: 60 }, () => dbSkins[Math.floor(Math.random() * dbSkins.length)]);
            setReel(initial);
        }
    }, [dbSkins]);

    const startSpin = () => {
        if (spinning || dbSkins.length === 0) return;

        // Reset state for new spin
        setDuration(0);       // Disable transition for instant reset
        setTranslateX(0);     // Jump back to start
        setShowModal(false);
        setSpinning(true);

        // 2. Determine Winner (Standard CS2 Odds)
        const roll = Math.random() * 100;
        let targetRarity = 'Mil-Spec';
        if (roll < 0.26) targetRarity = 'Extraordinary';
        else if (roll < 0.9) targetRarity = 'Covert';
        else if (roll < 4.09) targetRarity = 'Classified';
        else if (roll < 20.07) targetRarity = 'Restricted';

        const pool = dbSkins.filter(s => s.rarity.includes(targetRarity));
        const win = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : dbSkins[0];

        // 3. Prepare Reel
        const newReel = Array.from({ length: 60 }, () => dbSkins[Math.floor(Math.random() * dbSkins.length)]);
        newReel[WIN_INDEX] = win;
        setReel(newReel);
        setWinner(win);

        // 4. Trigger Animation
        // Calculate: (Item Offset) - (Center of Screen) + (Random Pixel Jitter)
        const jitter = Math.floor(Math.random() * 140) + 30;
        const finalX = (WIN_INDEX * ITEM_WIDTH) - 400 + jitter;

        // Small delay to ensure the reset (duration 0) has applied before starting the animation
        setTimeout(() => {
            setDuration(SPIN_DURATION); // Re-enable transition
            setTranslateX(finalX);      // Move to winner
        }, 100);

        // 5. End Spin
        setTimeout(() => {
            setSpinning(false);
            setShowModal(true);
        }, SPIN_DURATION + 600); // 100ms delay + duration + buffer
    };

    return (
        <div className="min-h-screen bg-[#0b0c11] text-white flex flex-col items-center justify-center overflow-hidden">
            {/* Sound Effect (Optional) */}
            <audio ref={audioTick} src="/sounds/tick.mp3" preload="auto" />

            {/* Case Header */}
            <div className="mb-10 text-center animate-in fade-in slide-in-from-top duration-700">
                <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    {caseName.replace(/_/g, ' ')}
                </h1>
                <p className="text-gray-500 tracking-[0.4em] text-xs mt-2 uppercase">Container Series</p>
            </div>

            {/* The Spinner Viewport */}
            <div className="relative w-full max-w-[800px] h-64 bg-[#12151e] border-y-2 border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">

                {/* Center Pointer */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-400 z-30 shadow-[0_0_20px_#eab308]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-yellow-400" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-yellow-400" />
                </div>

                {/* The Reel */}
                <div
                    ref={containerRef}
                    className="flex h-full transition-transform"
                    style={{
                        transform: `translateX(-${translateX}px)`,
                        transitionDuration: `${duration}ms`,
                        transitionTimingFunction: 'cubic-bezier(0.08, 0, 0.05, 1)'
                    }}
                >
                    {reel.map((skin, i) => (
                        <SkinCard key={`${skin.id}-${i}`} skin={skin} caseName={caseName} />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <button
                onClick={startSpin}
                disabled={spinning}
                className="mt-16 px-20 py-5 bg-[#5e911a] hover:bg-[#72ad20] disabled:bg-gray-800 disabled:text-gray-500 text-white font-black text-2xl uppercase tracking-tighter transition-all transform active:scale-95 shadow-xl"
            >
                {spinning ? 'Opening Case...' : `Open ${caseName.replace(/_/g, ' ')}`}
            </button>


            {/* Winning Modal */}
            {showModal && winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-300">
                    <div className="text-center">
                        <div className="relative mb-6">
                            <div className={`absolute inset-0 blur-[100px] opacity-40 ${getRarityStyles(winner.rarity).bg}`} />
                            <img
                                src={`/${caseName.replace(/ /g, '_')}/${encodeURIComponent(winner.name)}.jpeg`}
                                alt={winner.name}
                                className="w-80 h-80 object-contain relative z-10 animate-in zoom-in duration-500"
                            />
                        </div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter italic">{winner.weapon}</h2>
                        <p className={`text-3xl font-bold mb-8 ${getRarityStyles(winner.rarity).text}`}>{winner.name}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-white text-black px-12 py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Sub-component for individual cards ---
function SkinCard({ skin, caseName }: { skin: Skin, caseName: string }) {
    const styles = getRarityStyles(skin.rarity);

    return (
        <div className="w-[200px] h-full flex-shrink-0 border-r border-white/5 relative bg-gradient-to-b from-transparent to-white/[0.03]">
            <div className="flex flex-col items-center justify-center h-full p-6">
                <img
                    src={`/${caseName.replace(/ /g, '_')}/${encodeURIComponent(skin.name)}.jpeg`}
                    alt={skin.name}
                    className="w-32 h-32 object-contain drop-shadow-xl"
                    onError={(e) => console.error(`Failed to load image: ${skin.name}`, e.currentTarget.src)}
                />
                <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate w-32">{skin.weapon}</p>
                    <p className="text-sm font-bold truncate w-40">{skin.name}</p>
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${styles.bg}`} />
        </div>
    );
}
