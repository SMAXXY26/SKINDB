import prisma from '@/lib/prisma';
import CaseOpening, { Skin } from '../CaseOpening';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        caseName: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { caseName } = await params;
    const decodedCaseName = decodeURIComponent(caseName);

    // url param: "Prisma_2_Case" or "Bravo" or "CSGO_Weapon_Case"
    // db query needs: "Prisma 2 Case" or "Bravo Case" or "CS:GO Weapon Case"
    // Normalize underscores and restore colons for DB search
    let dbQueryName = decodedCaseName.replace(/_/g, ' ').replace('CSGO', 'CS:GO');

    // Attempt to find the case
    // We try multiple variations to ensure we find it
    const candidates = [
        dbQueryName,                     // "Winter Offensive"
        decodedCaseName,                 // "Winter_Offensive"
        dbQueryName.replace(' Weapon Case', ''), // "Operation Phoenix"
        decodedCaseName.replace('CSGO', 'CS:GO') // "CS:GO_Weapon_Case_3"
    ];

    const selectedCase = await prisma.cases.findFirst({
        where: {
            name: {
                in: candidates,
                mode: 'insensitive'
            }
        }
    });

    let skins: Skin[] = [];

    if (selectedCase) {
        const skins = await prisma.skin.findMany({
            where: {
                caseId: selectedCase.id
            }
        });

        // Fallback for legacy data where Skin.caseId doesn't match Cases.id
        if (skins.length === 0) {
            console.log(`Standard lookup failed for ${selectedCase.name} (ID: ${selectedCase.id}). Trying legacy mapping.`);

            const LEGACY_MAP: Record<string, string> = {
                'Operation Bravo Case': 'Bravo',
                'Bravo': 'Bravo', // Handle simpler name
                'CS:GO Weapon Case': 'Weapon1',
                'CS:GO Weapon Case 2': 'Weapon2',
                'CS:GO Weapon Case 3': 'Weapon3',
                'eSports 2013 Winter Case': 'esports_winter',
                'eSports 2013 Case': 'eSports_2013',
                'Glove Case': 'Glove',
                'Winter_Offensive': 'Winter',
                'Operation Phoenix Weapon Case': 'Phoenix',
                'Phoenix': 'Phoenix'
            };

            const legacyId = LEGACY_MAP[selectedCase.name];
            if (legacyId) {
                const legacySkins = await prisma.skin.findMany({
                    where: { caseId: legacyId }
                });
                if (legacySkins.length > 0) {
                    // Push matches
                    skins.push(...legacySkins);
                }
            }
        }

        // Pass final skins list (standard or legacy)
        return <CaseOpening dbSkins={skins} caseName={decodedCaseName} />;
    } else {
        console.warn(`Case ${dbQueryName} not found in database. Param was: ${caseName}`);
    }

    return <CaseOpening dbSkins={skins} caseName={decodedCaseName} />;
}
