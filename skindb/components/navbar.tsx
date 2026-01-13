import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.5)] transform rotate-3"></div>
                <Link href="/" className="text-2xl font-black tracking-tighter text-white uppercase italic">
                    Skin<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">DB</span>
                </Link>
            </div>
            <ul className="flex items-center gap-8">
                <li>
                    <Link href="/Collection" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                        Collections
                    </Link>
                </li>
                <li>
                    <Link href="/hot-cases" className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                        🔥 Hot Cases
                    </Link>
                </li>
                <li>
                    <Link href="/sim" className="px-5 py-2 text-xs font-black text-black uppercase bg-white rounded-sm hover:bg-gray-200 transition-transform active:scale-95 tracking-widest border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Opening
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;