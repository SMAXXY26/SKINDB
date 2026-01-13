import React from "react";
import Image from "next/image";

const CaseTile: React.FC<{ imageUrl: string; name: string }> = ({ imageUrl, name }) => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-40 filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            {name && (
                <div className="mt-4 px-4 py-1 border border-white/20 bg-black/40 backdrop-blur-md rounded-full">
                    <span className="text-white text-sm font-bold tracking-wider uppercase">{name}</span>
                </div>
            )}
        </div>
    );
}
export default CaseTile;