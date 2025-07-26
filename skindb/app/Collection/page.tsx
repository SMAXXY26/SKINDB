import React from "react";
import Navbar from "@/components/navbar";
import prisma from "@/lib/prisma";
import CaseTile from "@/components/CaseTile";
import Link from "next/link";
import White2Under from "@/lib/White2Under";

async function CollectionPage(){
    const cases=await prisma.cases.findMany({
        where:{
            id:{
                in:["0","1","22","32","4","5"]
            }
        }
    });
    return(
        <div>
            <Navbar />
            <div className="flex justify-around h-screen">
                <div className="p-10 grid grid-cols-3 gap-5 w-4/5 h-screen bg-[#333446]">
                    {cases.map((caseItem) => (
                        <div className="flex items-center justify-around" key={caseItem.id}>
                            <div className="justify-center ">
                                <Link href={`/${White2Under(caseItem.name)}`}>
                                    <CaseTile imageUrl={`/Case/${caseItem.name}.jpeg`} name={caseItem.name} />
                                </Link>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CollectionPage;
