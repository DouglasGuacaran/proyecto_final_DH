'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

// Cambiar el nombre de la función a 'Page' para seguir la convención de los componentes de React
export default function Page() {
  const { theme } = useTheme();

  return (
    <section className={`w-full flex flex-col justify-center items-center mt-10 pt-20 pb-10 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#F4F4F4] text-black'}`}>
      <div className='flex justify-evenly w-full max-w-screen-xl'>
        <div className='flex flex-col gap-8 justify-center'>
          <h1 className='text-5xl font-medium'>Políticas del Producto</h1>
          <p className='w-[400px]'>Bienvenido a nuestra plataforma de reserva de canchas deportivas. Aquí están nuestras políticas:</p>
          <ul>
            <li><strong>Reservas:</strong> Puedes reservar una cancha con hasta 30 días de antelación. Las reservas deben ser confirmadas al menos 24 horas antes del tiempo de juego.</li>
            <li><strong>Cancelaciones:</strong> Las cancelaciones deben realizarse al menos 48 horas antes del tiempo de juego para obtener un reembolso completo. Las cancelaciones dentro de las 48 horas tendrán una penalización del 50%.</li>
            <li><strong>Puntualidad:</strong> Te pedimos que llegues a tiempo para tu reserva. Si llegas tarde, el tiempo perdido no será reembolsado.</li>
            <li><strong>Responsabilidad:</strong> Los usuarios son responsables de cualquier daño causado a las instalaciones durante el tiempo de su reserva.</li>
            <li><strong>Condiciones Climáticas:</strong> En caso de mal tiempo, podrás reprogramar tu reserva sin penalización.</li>
          </ul>
        </div>
        <div className='hidden md:block rounded-md shadow-xl'>
          <Image 
            className='rounded-md shadow-xl'
            src={'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            width={350} 
            height={350}
            alt='Imagen del hero'
          />
        </div>
      </div>
    </section>
  );
}


