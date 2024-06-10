'use client';
import React, { useState, useEffect } from 'react';
import Card from '../card/Card';
import { useTheme } from '@/context/ThemeContext';

const Gallery = ({ searchResults }) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page whenever searchResults change
  }, [searchResults]);

  // Ensure searchResults is always an array
  const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentData = safeSearchResults.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(safeSearchResults.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className={`flex flex-col my-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {safeSearchResults.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mx-auto px-10">
            {currentData.map((item) => (
              <Card key={item.id} dataCancha={item} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <nav>
              <ul className="flex pl-0 list-none rounded my-2 space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-2 ml-0 leading-tight ${
                        theme === 'dark' ? 
                        'bg-gray-800 text-white border-gray-700 hover:bg-gray-600' : 
                        'bg-white text-black border-gray-300 hover:bg-gray-200 hover:text-gray-700'
                      } rounded-lg`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-2xl">No hay disponibilidad de canchas</h2>
        </div>
      )}
    </section>
  );
};

export default Gallery;
