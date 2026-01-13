import Navbar from "@/components/navbar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HotCasesPage() {
    // Fetch a sample of high-value skins from various cases for the "hot" cases
    const allSkins = await prisma.skin.findMany({
        take: 100,
        orderBy: {
            id: 'asc'
        }
    });

    // Define our "Hot Cases" - curated mystery boxes with different themes
    const hotCases = [
        {
            id: 'mega-jackpot',
            name: 'Mega Jackpot',
            description: 'Premium skins with insane odds',
            price: 9.99,
            color: 'from-yellow-500 to-orange-600',
            glowColor: 'shadow-[0_0_40px_rgba(234,179,8,0.6)]',
            odds: {
                'Extraordinary': 1.5,
                'Covert': 5.0,
                'Classified': 15.0,
                'Restricted': 30.0,
                'Mil-Spec': 48.5
            }
        },
        {
            id: 'high-roller',
            name: 'High Roller',
            description: 'For the bold and brave',
            price: 4.99,
            color: 'from-purple-500 to-pink-600',
            glowColor: 'shadow-[0_0_40px_rgba(168,85,247,0.6)]',
            odds: {
                'Extraordinary': 0.5,
                'Covert': 3.0,
                'Classified': 10.0,
                'Restricted': 25.0,
                'Mil-Spec': 61.5
            }
        },
        {
            id: 'budget-blitz',
            name: 'Budget Blitz',
            description: 'Great value, solid rewards',
            price: 1.99,
            color: 'from-blue-500 to-cyan-600',
            glowColor: 'shadow-[0_0_40px_rgba(59,130,246,0.6)]',
            odds: {
                'Extraordinary': 0.1,
                'Covert': 1.0,
                'Classified': 5.0,
                'Restricted': 20.0,
                'Mil-Spec': 73.9
            }
        },
        {
            id: 'knife-paradise',
            name: 'Knife Paradise',
            description: 'Increased knife drop rates',
            price: 14.99,
            color: 'from-red-500 to-rose-600',
            glowColor: 'shadow-[0_0_40px_rgba(239,68,68,0.6)]',
            odds: {
                'Extraordinary': 5.0,
                'Covert': 10.0,
                'Classified': 20.0,
                'Restricted': 30.0,
                'Mil-Spec': 35.0
            }
        }
    ];

    return (
        <div className="min-h-screen bg-[#08090d] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-16 text-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent -z-10" />

                    <div className="inline-block mb-4 px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">🔥 Limited Time</span>
                    </div>

                    <h1 className="text-7xl font-black italic tracking-tighter uppercase mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
                            Hot Cases
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Exclusive mystery boxes with curated skins and boosted odds.
                        <span className="text-yellow-500 font-bold"> Higher risk, higher rewards.</span>
                    </p>
                </div>

                {/* Hot Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {hotCases.map((hotCase) => (
                        <Link
                            key={hotCase.id}
                            href={`/hot-cases/${hotCase.id}`}
                            className="group block"
                        >
                            <div className={`relative bg-[#12141a] border-2 border-white/5 rounded-2xl p-8 transition-all duration-300 hover:border-yellow-500/30 hover:scale-[1.02] ${hotCase.glowColor} hover:shadow-2xl overflow-hidden`}>
                                {/* Animated Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${hotCase.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                                {/* Glow Effect */}
                                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${hotCase.color} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} />

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className={`text-3xl font-black uppercase tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r ${hotCase.color}`}>
                                                {hotCase.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{hotCase.description}</p>
                                        </div>
                                        <div className={`px-4 py-2 bg-gradient-to-r ${hotCase.color} rounded-lg font-black text-white text-xl`}>
                                            ${hotCase.price}
                                        </div>
                                    </div>

                                    {/* Odds Display */}
                                    <div className="space-y-2 mb-6">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Drop Rates</p>
                                        {Object.entries(hotCase.odds).map(([rarity, chance]) => (
                                            <div key={rarity} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${rarity === 'Extraordinary' ? 'bg-yellow-500' :
                                                            rarity === 'Covert' ? 'bg-red-500' :
                                                                rarity === 'Classified' ? 'bg-purple-500' :
                                                                    rarity === 'Restricted' ? 'bg-blue-500' :
                                                                        'bg-gray-500'
                                                        }`} />
                                                    <span className="text-sm text-gray-300">{rarity}</span>
                                                </div>
                                                <span className="text-sm font-bold text-white">{chance}%</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <button className={`w-full py-4 bg-gradient-to-r ${hotCase.color} rounded-lg font-black uppercase tracking-wider text-white transition-all group-hover:scale-105 group-hover:shadow-lg`}>
                                        Open Now
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info Section */}
                <div className="bg-[#12141a] border border-white/5 rounded-2xl p-8">
                    <h2 className="text-2xl font-black uppercase mb-4 text-yellow-500">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-gray-400">
                        <div>
                            <div className="text-4xl mb-2">🎲</div>
                            <h3 className="font-bold text-white mb-2">Choose Your Case</h3>
                            <p className="text-sm">Select from our curated Hot Cases with different price points and odds.</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-2">🎰</div>
                            <h3 className="font-bold text-white mb-2">Roll the Dice</h3>
                            <p className="text-sm">Each case contains random skins from our entire collection with boosted drop rates.</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-2">💎</div>
                            <h3 className="font-bold text-white mb-2">Win Big</h3>
                            <p className="text-sm">Higher-tier cases offer better odds for rare and extraordinary items.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
