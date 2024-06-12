/*import React from 'react'
import { Button } from '../ui/button';


const CardFavoritos = ({ favorites }) => {


    const { Nombre, Precio_hora, Imagen_cancha } = favorites;
    

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{Nombre}</h2>
        <Button variant="outline">Detalle de la cancha</Button>
      </div>
      <div className="mb-4">
        <img src={Imagen_cancha?.Url_img || '/default-image.jpg'} alt={`Imagen de ${Nombre}`} className="w-full h-auto rounded-lg" />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-600">{`Precio por hora: $${Precio_hora}`}</p>
      </div>
    </div>
  )
}

export default CardFavoritos*/

import React from 'react';
import { Button } from '../ui/button';

const CardFavoritos = ({ favorites }) => {
  console.log(favorites); // Agregar este console.log para depurar

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {favorites.map((favorite, index) => {
        // Verificar si el ID de la cancha está presente en los favoritos
        if (!favorite.id) return null; // Asegurar que el objeto tenga un ID
        return (
          <div key={index}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{favorite.Nombre}</h2>
              <Button variant="outline">Detalle de la cancha</Button>
            </div>
            <div className="mb-4">
              <img src={favorite.Imagen_cancha[0]?.Url_img || '/default-image.jpg'} alt={`Imagen de ${favorite.Nombre}`} className="w-full h-auto rounded-lg" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{`Precio por hora: $${favorite.Precio_hora}`}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardFavoritos;

