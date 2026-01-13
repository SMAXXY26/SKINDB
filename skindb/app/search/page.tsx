'use client';
import React from "react";
// import SearchBar from "@/components/searchbar";
import Navbar from "@/components/navbar";

function Search() {
    return (
        <div className="min-h-screen bg-[#08090d] text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 flex flex-col items-center justify-center">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Search Database</h1>
                    <p className="text-gray-500 mt-2">Find your favorite skins.</p>
                </div>

                <div className="w-full max-w-2xl bg-[#15171e] border border-white/5 rounded-2xl p-8 text-center text-gray-500">
                    <p>Search functionality is currently being upgraded.</p>
                    {/* <SearchBar /> */}
                </div>
            </div>
        </div>
    )
}

export default Search;