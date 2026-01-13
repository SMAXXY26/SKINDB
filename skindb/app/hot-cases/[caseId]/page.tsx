import prisma from '@/lib/prisma';
import CaseOpening, { Skin } from '../../sim/CaseOpening';
import Navbar from "@/components/navbar";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        caseId: string;
    }>;
}

// Define the hot case configurations (must match the hub page)
const HOT_CASE_CONFIGS = {
    'mega-jackpot': {
        name: 'Mega Jackpot',
        price: 9.99,
        odds: {
            'Extraordinary': 1.5,
            'Covert': 5.0,
            'Classified': 15.0,
            'Restricted': 30.0,
            'Mil-Spec': 48.5
        }
    },
    'high-roller': {
        name: 'High Roller',
        price: 4.99,
        odds: {
            'Extraordinary': 0.5,
            'Covert': 3.0,
            'Classified': 10.0,
            'Restricted': 25.0,
            'Mil-Spec': 61.5
        }
    },
    'budget-blitz': {
        name: 'Budget Blitz',
        price: 1.99,
        odds: {
            'Extraordinary': 0.1,
            'Covert': 1.0,
            'Classified': 5.0,
            'Restricted': 20.0,
            'Mil-Spec': 73.9
        }
    },
    'knife-paradise': {
        name: 'Knife Paradise',
        price: 14.99,
        odds: {
            'Extraordinary': 5.0,
            'Covert': 10.0,
            'Classified': 20.0,
            'Restricted': 30.0,
            'Mil-Spec': 35.0
        }
    }
};

export default async function HotCasePage({ params }: PageProps) {
    const { caseId } = await params;

    // Get the configuration for this hot case
    const config = HOT_CASE_CONFIGS[caseId as keyof typeof HOT_CASE_CONFIGS];

    if (!config) {
        return (
            <div className="min-h-screen bg-[#08090d] text-white">
                <Navbar />
                <div className="pt-32 text-center">
                    <h1 className="text-4xl font-bold">Hot Case Not Found</h1>
                </div>
            </div>
        );
    }

    // Fetch random skins from all cases to populate this hot case
    // We'll get a diverse mix across all rarities
    const allSkins = await prisma.skin.findMany({
        take: 200, // Get a good pool to choose from
    });

    // Filter and organize skins by rarity
    const skinsByRarity: Record<string, Skin[]> = {
        'Extraordinary': [],
        'Covert': [],
        'Classified': [],
        'Restricted': [],
        'Mil-Spec': []
    };

    allSkins.forEach(skin => {
        const rarity = skin.rarity;
        if (rarity.includes('Extraordinary')) skinsByRarity['Extraordinary'].push(skin);
        else if (rarity.includes('Covert')) skinsByRarity['Covert'].push(skin);
        else if (rarity.includes('Classified')) skinsByRarity['Classified'].push(skin);
        else if (rarity.includes('Restricted')) skinsByRarity['Restricted'].push(skin);
        else if (rarity.includes('Mil-Spec')) skinsByRarity['Mil-Spec'].push(skin);
    });

    // Create a curated pool for this hot case (mix of all rarities)
    const hotCaseSkins: Skin[] = [];

    // Add skins from each rarity tier based on availability
    Object.entries(skinsByRarity).forEach(([rarity, skins]) => {
        const count = Math.min(skins.length, 15); // Up to 15 per rarity
        for (let i = 0; i < count; i++) {
            if (skins[i]) hotCaseSkins.push(skins[i]);
        }
    });

    // If we don't have enough skins, just use all available
    const finalSkins = hotCaseSkins.length > 0 ? hotCaseSkins : allSkins;

    return (
        <div className="min-h-screen bg-[#08090d] text-white">
            <Navbar />
            <div className="pt-24">
                <CaseOpening
                    dbSkins={finalSkins}
                    caseName={config.name}
                    customOdds={config.odds}
                />
            </div>
        </div>
    );
}
