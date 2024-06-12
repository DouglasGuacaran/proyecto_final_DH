'use client'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'
import Footer from '@/components/footer/Footer'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import CardFavoritos from '@/components/cardFavoritos/CardFavoritos';

const Page = () => {

    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
      // Función para cargar los favoritos desde localStorage
      const loadFavorites = () => {
        try {
          const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
          if (user && storedFavorites[user.id]) {
            setFavorites(storedFavorites[user.id]);
          }
        } catch (error) {
          console.error("Error loading favorites from localStorage:", error);
        }
      };

      // Llamar a la función para cargar los favoritos
      loadFavorites();
    }, [user]);

    const handleRemoveFavorite = (id) => {
        const updatedFavorites = favorites.filter(favorite => favorite.id !== id);
        setFavorites(updatedFavorites);

        try {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
            if (user) {
                storedFavorites[user.id] = updatedFavorites;
                localStorage.setItem('favorites', JSON.stringify(storedFavorites));
            }
        } catch (error) {
            console.error("Error updating favorites in localStorage:", error);
        }
    };

    console.log(favorites);

  return (
    <>
        <Navbar/>
        <div className='mt-20 container mx-auto p-5'>
        <h1 className="text-2xl font-bold mb-5">Mis Favoritos</h1>
          {favorites.length === 0 ? (
              <p>No tienes favoritos guardados.</p>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <CardFavoritos favorites={favorites} onRemoveFavorite={handleRemoveFavorite} />
              </div>
          )}
          </div>
        <Footer />
    </>
  )

}
export default Page

