import React from "react";
import Navbar from "@/components/navbar";
import prisma from "@/lib/prisma";
import CaseTile from "@/components/CaseTile";
import Link from "next/link";
import White2Under from "@/lib/White2Under";



async function CollectionPage() {
    const cases = await prisma.cases.findMany({
        where: {
            id: {
                in: ["0", "1", "22", "32", "4", "5", "2", "3", "6", "8"]
            }
        }
    });

    return (
        <div className="min-h-screen bg-[#08090d] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">
                        Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Collections</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Browse through standard and limited edition weapon cases.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((caseItem) => (
                        <div key={caseItem.id} className="group">
                            <Link href={`/${caseItem.name === 'Prisma 2 Case' ? 'sim' : White2Under(caseItem.name)}`} className="block h-full">
                                {/* ^ Note: Temporarily routing 'Prisma 2 Case' to /sim since we standardized sim page there. 
                                    Ideally we'd have a dynamic case page [caseId] but adhering to user structure for now. */}
                                <div className="bg-[#12141a] border border-white/5 rounded-2xl p-6 h-full transition-all duration-300 group-hover:bg-[#1a1d26] group-hover:border-purple-500/30 group-hover:scale-[1.02] shadow-lg group-hover:shadow-purple-900/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12V7h-2v5h-2v5h2v-2h2v-2h2v-1h-2zM4 12V7h2v5h2v5H6v-2H4v-2H2v-1h2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        {/* Pass extra styles to CaseTile if it supports it, otherwise wrap it */}
                                        <div className="transform group-hover:scale-110 transition-transform duration-500">
                                            <CaseTile imageUrl={`/Case/${encodeURIComponent(
                                                caseItem.name
                                                    .replace('CS:GO', 'CSGO')
                                                    .replace('Operation Phoenix Weapon Case', 'Phoenix')
                                            )
                                                }.jpeg`} name={""} />
                                            {/* Passed empty name to Tile because we render it custom below for better style */}
                                        </div>

                                        <h3 className="mt-6 text-xl font-bold text-center uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                                            {caseItem.name}
                                        </h3>
                                        <p className="mt-2 text-xs text-gray-500 font-mono uppercase tracking-[0.2em]">Weapon Case</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CollectionPage;


