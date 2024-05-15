'use client';
import { createClient } from '@/utils/supabase/client';
import React, { createContext, useState, useContext, useEffect } from 'react';

const CanchasContext = createContext();

export const useCanchas = () => {
  return useContext(CanchasContext);
};

export const CanchasProvider = ({ children }) => {
  const [canchas, setCanchas] = useState([]);

  async function fetchCanchas() {
    const supabase = createClient();
    const { data: canchas, error } = await supabase
      .from('Cancha')
      .select(
        `
          id,
          Nombre,
          Direccion,
          Superficie,
          Tamanio,
          Precio_hora,
          Disciplina_id,
          Imagen_cancha (
          Url_img
          ),
          Disciplina (
          Nombre
          )
        `
      )
      .order('id', { foreignTable: 'Imagen_cancha', ascending: true });

    if (error) {
      console.error('Error al obtener las canchas e imágenes:', error);
      return;
    }

    const dataCanchas = canchas.map((cancha) => ({
      ...cancha,
      imagen: cancha.Imagen_cancha[0]?.Url_img || 'default-image-path.jpg',
    }));

    setCanchas(dataCanchas);
  }

  useEffect(() => {
    fetchCanchas();
  }, []);

  return (
    <CanchasContext.Provider value={{ canchas, fetchCanchas }}>
      {children}
    </CanchasContext.Provider>
  );
};
