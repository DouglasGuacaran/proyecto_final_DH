import Image from 'next/image';
import React from 'react';
import Search from '../search/Search';

export default function Hero() {
  return (
    <section className='w-full flex flex-col justify-center items-center mt-10 bg-[#F4F4F4] pt-20 pb-10'>
      <div className='flex  justify-evenly w-full max-w-screen-xl'>
        <div className=' flex flex-col gap-8 justify-center'>
          <h1 className='text-5xl font-medium'>Juega con el corazón</h1>
          <h2 className='text-3xl font-medium'>Tu cancha te espera</h2>
          <p className='w-[400px]'>Descubre la forma más fácil y rápida de reservar canchas para tus deportes favoritos.</p>
        </div>
        <Image className='hidden md:block rounded-md shadow-xl' src={'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} width={350} height={350} />
      </div>
      <Search />
    </section>
  );
}
