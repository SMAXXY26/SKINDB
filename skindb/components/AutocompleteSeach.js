import prisma from "@/lib/prisma";

async function fetchData(){
    const Data=await prisma.skin.findMany({
        select: {
          name: true,
        },
      })}

const lowercasedData = Data.tolowerCase();
const Suggestion=Data.filter(item=>
    item.tolowerCase().includes(lowercasedData)
);

setTimeout(() => {}, 1000);