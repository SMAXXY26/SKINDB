import React from "react";
import Image from "next/image";

const SkinTile: React.FC<{
    order?: number;
    imageUrl: string;
    name: string;
    rarity: string;
    color: string
}> = ({ color, order, imageUrl, name, rarity }) => {
    return (
        <div
            style={{ order, borderColor: color }}
            className="group relative flex flex-col items-center bg-[#15171e] border-b-4 rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-white/5"
        >
            {/* Background Glow based on rarity color */}
            <div
                style={{ backgroundColor: color }}
                className="absolute top-0 inset-x-0 h-32 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
            />

            <div className="relative w-full h-48 p-6 z-10">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="w-full p-4 bg-[#1a1d26] z-10 border-t border-white/5">
                <h3 className="text-white font-bold text-center truncate tracking-wide text-sm md:text-base">
                    {name}
                </h3>
                <div className="mt-2 flex justify-center">
                    <span
                        style={{ color: color }}
                        className="text-[10px] uppercase font-black tracking-[0.2em] border border-white/10 px-2 py-0.5 rounded bg-black/20"
                    >
                        {rarity}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SkinTile;