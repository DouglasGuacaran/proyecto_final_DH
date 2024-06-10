'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

// Cambiar el nombre de la función a 'Page' para seguir la convención de los componentes de React
export default function Page() {
  const { theme } = useTheme();

  return (
    <section className={`w-full flex flex-col items-center mt-10 pt-20 pb-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#F4F4F4] text-black'}`}>
      <div className='flex flex-col md:flex-row justify-evenly w-full max-w-screen-xl px-4 md:px-8'>
        {/* Contenedor del bloque de políticas */}
        <div className='flex flex-col gap-8 justify-center w-full md:w-2/3'>
          {/* Título del bloque */}
          <h1 className='text-5xl font-bold underline mb-4'>Políticas del Producto</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Políticas distribuidas en columnas */}
            <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
              <h2 className='text-2xl font-semibold mb-2'>Reservas</h2>
              <p>Puedes reservar una cancha con hasta 30 días de antelación. Las reservas deben ser confirmadas al menos 24 horas antes del tiempo de juego.</p>
            </div>
            <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
              <h2 className='text-2xl font-semibold mb-2'>Cancelaciones</h2>
              <p>Las cancelaciones deben realizarse al menos 48 horas antes del tiempo de juego para obtener un reembolso completo. Las cancelaciones dentro de las 48 horas tendrán una penalización del 50%.</p>
            </div>
            <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
              <h2 className='text-2xl font-semibold mb-2'>Puntualidad</h2>
              <p>Te pedimos que llegues a tiempo para tu reserva. Si llegas tarde, el tiempo perdido no será reembolsado.</p>
            </div>
            <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
              <h2 className='text-2xl font-semibold mb-2'>Responsabilidad</h2>
              <p>Los usuarios son responsables de cualquier daño causado a las instalaciones durante el tiempo de su reserva.</p>
            </div>
            <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
              <h2 className='text-2xl font-semibold mb-2'>Condiciones Climáticas</h2>
              <p>En caso de mal tiempo, podrás reprogramar tu reserva sin penalización.</p>
            </div>
          </div>
        </div>
        {/* Imagen del hero */}
        <div className='hidden md:block rounded-md shadow-xl md:w-1/3'>
          <Image 
            className='rounded-md shadow-xl'
            src={'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            width={370} 
            height={370}
            alt='Imagen de canchas deportivas'
          />
        </div>
      </div>
    </section>
  );
}