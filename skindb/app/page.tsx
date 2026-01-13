import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090d] text-white selection:bg-yellow-500/30">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden px-4">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-xs font-bold tracking-[0.2em] text-yellow-400 uppercase">The Ultimate Database</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Counter</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Strike 2</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">Skins</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Explore collections, simulate cases, and discover the rarest finishes in the game.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <Link
              href="/Collection"
              className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)] clip-path-slant"
            >
              Browse Collections
            </Link>
            <Link
              href="/sim"
              className="px-10 py-4 bg-transparent border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all hover:border-white/50 backdrop-blur-sm"
            >
              Try Simulator
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
