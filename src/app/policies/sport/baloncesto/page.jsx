'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  const { theme } = useTheme();

  return (
    <section className={`w-full flex flex-col items-center justify-center mt-10 pt-20 pb-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#F4F4F4] text-black'}`}>
      <div className='w-full max-w-screen-xl'>
        <div className='flex flex-col md:flex-row justify-center'>
          <div className='flex flex-col gap-8 justify-center w-full md:w-2/3'>
            <h1 className='text-5xl font-bold underline mb-4 text-center'>Políticas para arriendo de canchas de Baloncesto</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
                <h2 className='text-2xl font-semibold mb-2'>Reservas</h2>
                <p>Puedes reservar una cancha de baloncesto con hasta 30 días de antelación. Las reservas deben ser confirmadas al menos 24 horas antes del tiempo de juego.</p>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
                <h2 className='text-2xl font-semibold mb-2'>Cancelaciones</h2>
                <p>Las cancelaciones deben realizarse al menos 48 horas antes del tiempo de juego para obtener un reembolso completo. Las cancelaciones dentro de las 48 horas tendrán una penalización del 50%.</p>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
                <h2 className='text-2xl font-semibold mb-2'>Puntualidad</h2>
                <p>Te pedimos que llegues a tiempo para tu reserva de baloncesto. Si llegas tarde, el tiempo perdido no será reembolsado.</p>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
                <h2 className='text-2xl font-semibold mb-2'>Responsabilidad</h2>
                <p>Los usuarios son responsables de cualquier daño causado a las instalaciones durante el tiempo de su reserva de baloncesto.</p>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
                <h2 className='text-2xl font-semibold mb-2'>Condiciones Climáticas</h2>
                <p>En caso de mal tiempo, podrás reprogramar tu reserva de baloncesto sin penalización.</p>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg'>
                <h2 className='text-2xl font-semibold mb-2'>Equipo Propio</h2>
                <p>Permitimos que traigas tu propio equipo para jugar, pero asegúrate de que sea adecuado para la superficie de la cancha.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href="/policies">
  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-8">
    Volver a Politicas Generales
  </button>
</Link>
    </section>
  );
}

