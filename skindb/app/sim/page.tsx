import Navbar from "@/components/navbar";
import prisma from "@/lib/prisma";
import CaseTile from "@/components/CaseTile";
import Link from "next/link";
import White2Under from "@/lib/White2Under";

export const dynamic = 'force-dynamic';

export default async function SimHubPage() {
  // Fetch cases to display. 
  // You might want to filter or limit this list, or show all.
  const cases = await prisma.cases.findMany({
    where: {
      // Fetching all relevant cases or filtered list
      id: {
        in: ["0", "1", "22", "32", "4", "5", "2", "3", "6", "8"] // Matching the IDs used in Collection page for consistency
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4">
            Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 animate-pulse">Opening</span>
          </h1>
          <p className="text-gray-400 text-lg tracking-widest uppercase">Select a case to open</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cases.map((caseItem) => {
            // Ensure route matches folder structure
            let routeName = White2Under(caseItem.name).replace('CS:GO', 'CSGO');

            // Heuristic fixes for known folder names
            if (caseItem.name.includes('Bravo')) routeName = 'Bravo';
            if (caseItem.name === 'eSports 2013 Winter Case') routeName = 'eSports_2013_Winter_Case';

            return (
              <div key={caseItem.id} className="group relative">
                <Link href={`/sim/${routeName}`} className="block">
                  <div className="bg-[#12141a] border border-white/5 rounded-2xl p-8 hover:bg-[#1a1d26] hover:border-yellow-500/30 transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-yellow-900/20 flex flex-col items-center">
                    <div className="scale-125 group-hover:drop-shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-500">
                      {/* Use sanitized name matching the renamed files without colons */}
                      <CaseTile imageUrl={`/Case/${encodeURIComponent(
                        caseItem.name
                          .replace('CS:GO', 'CSGO')
                          .replace('Winter_Offensive', 'Winter_Offensive') // Already good if name matches
                          .replace('Operation Phoenix Weapon Case', 'Phoenix') // Map long name to 'Phoenix.jpeg'
                      )
                        }.jpeg`} name={""} />
                    </div>
                    <h3 className="mt-8 text-xl font-black text-center uppercase tracking-wider group-hover:text-yellow-400 transition-colors">
                      {caseItem.name.replace(' Case', '')}
                    </h3>
                    <div className="mt-4 px-4 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                      Open
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}