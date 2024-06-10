'use client';
import React, { useState } from 'react';
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import Gallery from "@/components/gallery/Gallery";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <>
      <main>
        <Navbar />
        <Hero onSearch={handleSearchResults} />
        {hasSearched ? (
          searchResults.length > 0 ? (
            <Gallery data={searchResults} />
          ) : (
            <div className="text-center mt-10">
              <h2 className="text-2xl">No hay disponibilidad de canchas</h2>
            </div>
          )
        ) : (
          <div className="text-center mt-10">
            <h2 className="text-2xl">Por favor, realiza una búsqueda</h2>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
