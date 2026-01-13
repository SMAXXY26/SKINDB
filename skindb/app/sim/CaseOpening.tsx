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

// Helper to map caseId to folder name
const getCaseFolderName = (caseId: string | null): string => {
    if (!caseId) return 'Bravo'; // Default fallback

    const folderMap: Record<string, string> = {
        'Weapon1': 'CSGO_Weapon_Case',
        'Weapon2': 'CSGO_Weapon_Case_2',
        'Weapon3': 'CSGO_Weapon_Case_3',
        'Bravo': 'Bravo',
        'esports_winter': 'eSports_2013_Winter_Case',
        'eSports_2013': 'eSports_2013_Case',
        'Glove': 'Glove_Case',
        'Winter': 'Winter_Offensive',
        'Phoenix': 'Phoenix',
        'Prisma_2': 'Prisma_2_Case',
        '32': 'Prisma_2_Case', // ID-based fallback
    };

    return folderMap[caseId] || caseId;
};

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
const SPIN_DURATION = 10000; // ms - Longer for smoother feel


export default function CaseOpening({
    dbSkins,
    caseName,
    customOdds
}: {
    dbSkins: Skin[],
    caseName: string,
    customOdds?: Record<string, number>
}) {
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

        // 2. Determine Winner (Use custom odds if provided, otherwise standard CS2 odds)
        const roll = Math.random() * 100;
        let targetRarity = 'Mil-Spec';

        if (customOdds) {
            // Use custom odds for hot cases
            let cumulative = 0;
            for (const [rarity, chance] of Object.entries(customOdds)) {
                cumulative += chance;
                if (roll < cumulative) {
                    targetRarity = rarity;
                    break;
                }
            }
        } else {
            // Standard CS2 odds
            if (roll < 0.26) targetRarity = 'Extraordinary';
            else if (roll < 0.9) targetRarity = 'Covert';
            else if (roll < 4.09) targetRarity = 'Classified';
            else if (roll < 20.07) targetRarity = 'Restricted';
        }

        const pool = dbSkins.filter(s => s.rarity.includes(targetRarity));
        const win = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : dbSkins[0];

        // 3. Prepare Reel with winner at WIN_INDEX
        const newReel = Array.from({ length: 60 }, () => dbSkins[Math.floor(Math.random() * dbSkins.length)]);
        newReel[WIN_INDEX] = win;

        // Set winner and reel together
        setWinner(win);
        setReel(newReel);

        // 4. Trigger Animation
        // Calculate: (Item Offset) - (Center of Screen) + (Random Pixel Jitter)
        const jitter = Math.floor(Math.random() * 140) + 30;
        const finalX = (WIN_INDEX * ITEM_WIDTH) - 400 + jitter;

        // Force a reflow/repaint to ensure we start from 0
        // We use double requestAnimationFrame to ensure the browser has painted the "reset" state (translateX: 0)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setDuration(SPIN_DURATION);
                setTranslateX(finalX);
            });
        });

        // 5. End Spin
        setTimeout(() => {
            setSpinning(false);
            setShowModal(true);
        }, SPIN_DURATION + 100); // duration + small buffer
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] w-full">
            {/* Sound Effect (Optional) */}
            <audio ref={audioTick} src="/sounds/tick.mp3" preload="auto" />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0b0c11] to-[#0b0c11] -z-10" />

            {/* Case Header */}
            <div className="mb-12 text-center animate-in fade-in slide-in-from-top duration-700">
                <h1 className="text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-sm">
                    {caseName.replace(/_/g, ' ')}
                </h1>
                <p className="text-yellow-500 tracking-[0.5em] text-xs mt-3 uppercase font-bold text-shadow-glow">
                    Provably Fair Case Opening
                </p>
            </div>

            {/* The Spinner Viewport */}
            <div className="relative w-full max-w-[1000px] h-72 bg-[#15171e] rounded-lg border-2 border-yellow-500/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden mb-8 ring-1 ring-white/5">

                {/* Vignette Overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0b0c11] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0b0c11] to-transparent z-20 pointer-events-none" />

                {/* Center Pointer (Updated Design) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-yellow-400 z-30 shadow-[0_0_15px_#eab308]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45 shadow-[0_0_10px_#eab308]" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45 shadow-[0_0_10px_#eab308]" />
                </div>

                {/* The Reel */}
                <div
                    ref={containerRef}
                    className="flex h-full items-center transition-transform will-change-transform"
                    style={{
                        transform: `translateX(-${translateX}px)`,
                        transitionDuration: `${duration}ms`,
                        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)' // Smooth ease-out
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
                className="group relative px-24 py-6 bg-gradient-to-tr from-green-600 to-green-500 text-white font-black text-2xl uppercase tracking-tighter clip-path-polygon disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)]"
                style={{
                    clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)"
                }}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                <span>{spinning ? 'Rolling...' : `Open Case`}</span>
            </button>

            {/* Price / Odds Mockup */}
            <div className="mt-8 flex gap-8 text-sm uppercase tracking-widest text-gray-500 font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]" />
                    <span>Cost: $2.49</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                    <span>Items: {dbSkins.length}</span>
                </div>
            </div>


            {/* Winning Modal */}
            {showModal && winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-300">
                    <div className="text-center">
                        <div className="relative mb-6">
                            <div className={`absolute inset-0 blur-[100px] opacity-40 ${getRarityStyles(winner.rarity).bg}`} />
                            <img
                                src={`/${getCaseFolderName(winner.caseId)}/${encodeURIComponent(winner.name)}.jpeg`}
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
                    src={`/${getCaseFolderName(skin.caseId)}/${encodeURIComponent(skin.name)}.jpeg`}
                    alt={skin.name}
                    className="w-32 h-32 object-contain drop-shadow-xl"
                    onError={(e) => console.error(`Failed to load image: ${skin.name} from ${getCaseFolderName(skin.caseId)}`, e.currentTarget.src)}
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
