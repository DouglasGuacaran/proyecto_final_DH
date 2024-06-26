import React from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';


const CardFavoritos = ({ favorites, onRemoveFavorite}) => {
    const { theme } = useTheme();


    // const { Nombre, Precio_hora, Imagen_cancha } = favorites;


  return (
    <>

             {favorites.map((favorite, index) => {
               // Verificar si el ID de la cancha está presente en los favoritos
               if (!favorite.id) return null; // Asegurar que el objeto tenga un ID
               return (
                 <div key={index} className={`w-full max-w-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'} rounded-lg shadow flex flex-col justify-between`}>
                   <div className="flex justify-between items-center mb-4 mt-5">
                     <h2 className="text-lg font-semibold tracking-tight w-full truncate text-center">{favorite.Nombre}</h2>
                   </div>
                   <div className="mb-4">
                     <Image
                      width={300}
                      height={300}
                      src={favorite.Imagen_cancha[0]?.Url_img || '/default-image.jpg'} alt={`Imagen de ${favorite.Nombre}`} className="w-full h-80 rounded-lg" />
                   </div>
                   <div className="flex items-center justify-center mt-4">
                     <p className="text-xl font-bold">{`Precio por hora: $${favorite.Precio_hora}`}</p>
                   </div>
                   <div className='flex justify-evenly mt-4 mb-10'>
                     <Link href={`/${favorite.id}`}>
                       <Button >Detalle de la cancha</Button>
                      </Link>
                     <Button variant="outline" onClick={() => onRemoveFavorite(favorite.id)}>Eliminar Favorito</Button>
                   </div>
                 </div>
               );
             })}

      </>
  )
}

export default CardFavoritos

// import React from 'react';
// import { Button } from '../ui/button';

// const CardFavoritos = ({ favorites }) => {
//   console.log(favorites); // Agregar este console.log para depurar

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 mb-4">
//       {favorites.map((favorite, index) => {
//         // Verificar si el ID de la cancha está presente en los favoritos
//         if (!favorite.id) return null; // Asegurar que el objeto tenga un ID
//         return (
//           <div key={index}>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">{favorite.Nombre}</h2>
//               <Button variant="outline">Detalle de la cancha</Button>
//             </div>
//             <div className="mb-4">
//               <img src={favorite.Imagen_cancha[0]?.Url_img || '/default-image.jpg'} alt={`Imagen de ${favorite.Nombre}`} className="w-full h-auto rounded-lg" />
//             </div>
//             <div className="flex justify-between items-center">
//               <p className="text-gray-600">{`Precio por hora: $${favorite.Precio_hora}`}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CardFavoritos;

