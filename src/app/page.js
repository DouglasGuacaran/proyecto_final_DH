'use client';
import React, { useState } from 'react';
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import Gallery from "@/components/gallery/Gallery";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(Array.isArray(results) ? results : []);
  };

  const clearSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <>
      <main>
        <Navbar />
        <Hero onSearch={handleSearchResults} clearSearchResults={clearSearchResults} />
        <Gallery searchResults={searchResults}/>
      </main>
      <Footer />
    </>
  );
}
