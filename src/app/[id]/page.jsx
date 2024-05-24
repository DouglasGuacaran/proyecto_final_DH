'use client';

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/navbar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from "next/image"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { id } = useParams();
  const [cancha, setCancha] = useState({});

  useEffect(() => {
    const getCanchaWithId = async (id) => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('Cancha')
        .select(
          `
          id,
          Nombre,
          Superficie,
          Tamanio,
          Precio_hora,
          Disciplina_id,
          Imagen_cancha (
            Url_img
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching cancha:', error);
      } else {
        const dataCancha = { ...data, imagen: data.Imagen_cancha[0].Url_img };

        setCancha(dataCancha);
      }
    };

    if (id) {
      getCanchaWithId(id);
    }
  }, [id]);

  const { Nombre, Precio_hora, imagen, Superficie, Tamanio } =
    cancha;

  return (
    <>
      <Navbar />
      <div className='mt-32 flex items-center mx-auto w-11/12'><Link href='/'><Button variant='outline'>Volver</Button></Link></div>
      <main className="flex items-center justify-center"> 
        <div className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow my-20 md:w-11/12 max-w-[1100px] mx-6">
          <Image
            className="flex-1 object-cover w-full rounded-t-lg h-96 md:h-80 md:w-48 md:rounded-none md:rounded-s-lg"
            src={imagen}
            width={48}
            height={80}
            priority
            alt="imagen de la cancha"
            />
          
          <div className="flex flex-col justify-between p-4 leading-normal flex-1 min-h-72">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {Nombre}
            </h5>
            <ul className="mb-3 font-normal text-gray-700 ">
                <li>{Superficie}, {Tamanio}</li>
                
                <li className='font-semibold text-lg mt-3'>$ {Precio_hora}</li>
            </ul>
            <Button>Reservar</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
