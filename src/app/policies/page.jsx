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
            <h1 className='text-5xl font-bold underline mb-4 text-center'>Políticas Generales</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-center'>
              <Link href="/policies/sport/futbol">
                <h2 className='text-2xl font-semibold mb-2'>Futbol</h2>
              </Link>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-center'>
              <Link href="/policies/sport/baloncesto">
                <h2 className='text-2xl font-semibold mb-2'>Baloncesto</h2>
              </Link>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-center'>
              <Link href="/policies/sport/padel">
                <h2 className='text-2xl font-semibold mb-2'>Pádel</h2>
              </Link>
              </div>
              <div className='p-4 bg-white shadow-md rounded-md transform transition-transform hover:scale-105 hover:shadow-lg flex items-center justify-center'>
              <Link href="/policies/sport/tenis">
                <h2 className='text-2xl font-semibold mb-2'>Tenis</h2>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Link href="/">
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-8">
          Volver al Home
        </button>
      </Link>
    </section>
  );
}
