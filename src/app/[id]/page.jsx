'use client';

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from "next/image";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function Page() {
  const { id } = useParams();
  const [cancha, setCancha] = useState({});
  const { theme } = useTheme();

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
          Caracteristicas,
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

  console.log(cancha.Caracteristicas);

  const { Nombre, Precio_hora, imagen, Superficie, Tamanio, Caracteristicas } = cancha;

  return (
    <>
      <Navbar />
      <main className={`flex flex-col items-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} min-h-screen p-6`}>
        <div className='mt-32 flex items-center mx-auto w-11/12'>
          <Link href='/'>
            <Button variant='outline' className={theme === 'dark' ? 'bg-gray-700 text-white' : ''}>Volver</Button>
          </Link>
        </div>
        <h1 className={`mb-4 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {Nombre}
        </h1>

        {imagen && (
          <div className="w-full max-w-4xl mb-6">
            <Image
              className="object-cover w-full rounded-lg"
              src={imagen}
              width={1200}  // Ajusta estos valores según sea necesario
              height={800}  // Ajusta estos valores según sea necesario
              priority
              alt="imagen de la cancha"
            />
          </div>
        )}

        <div className={`w-full max-w-4xl ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-200'} rounded-lg shadow p-6`}>
          <h6 className={`mb-4 text-center text-xl font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'}`}>Características</h6>

          <table className={`w-full mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <thead>
              <tr>
                <th className="border px-4 py-2">Característica</th>
                <th className="border px-4 py-2">Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {Caracteristicas && Object.keys(Caracteristicas).map((key) => (
                <tr key={key}>
                  <td className="border px-4 py-2">{key}</td>
                  <td className="border px-4 py-2 text-center">
                    {Caracteristicas[key] === 'True' ? (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className={`mb-6 font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>{Superficie}, {Tamanio}</li>
            <li className='font-semibold text-lg mt-3'>$ {Precio_hora}</li>
          </ul>

          <Button className='w-full'>Reservar</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}