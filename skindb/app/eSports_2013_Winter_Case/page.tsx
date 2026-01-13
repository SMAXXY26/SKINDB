import React from "react";
import Navbar from "@/components/navbar";
import SkinTile from "@/components/SkinTile";
import prisma from "@/lib/prisma";
import raritySort from "@/lib/raritySort";
import colorSort from "@/lib/colorSort";

async function CollectionPage() {
    const data = await prisma.skin.findMany({
        where: {
            caseId: 'esports_winter',
        },
    });

    return (
        <div className="min-h-screen bg-[#08090d] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">
                            <span className="text-blue-500">eSports</span> 2013 Winter
                        </h1>
                        <p className="text-gray-400 tracking-widest text-sm uppercase">Weapon Case Collection</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data.map((skin) => {
                        const order = raritySort(skin.rarity);
                        const color = colorSort(skin.rarity);

                        return (
                            <SkinTile
                                key={skin.id}
                                imageUrl={`/eSports_2013_Winter_Case/${skin.name}.jpeg`}
                                name={skin.name}
                                rarity={skin.rarity}
                                order={order}
                                color={color}
                            />
                        );
                    })}
                </div>

                {data.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p>No skins found for this case.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollectionPage;