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
import { useAuth } from '@/context/AuthContext'; // Importa el contexto de autenticación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Page() {
  const { id } = useParams();
  const [cancha, setCancha] = useState({});
  const { theme } = useTheme();
  const { user } = useAuth(); // Accede a la información del usuario

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
        const dataCancha = { ...data, imagen: data.Imagen_cancha.Url_img };

        setCancha(dataCancha);
      }
    };

    if (id) {
      getCanchaWithId(id);
    }
  }, [id]);

  const { Nombre, Precio_hora, Superficie, Tamanio, Caracteristicas, Imagen_cancha } = cancha;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

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
        <div className={`w-full max-w-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'} rounded-lg shadow flex flex-col justify-between`}>

        {Imagen_cancha && Imagen_cancha.length > 0 && (
          Imagen_cancha.length > 1 ? (
            <div className="w-full h-64 max-w-4xl mb-6">
              <Slider {...sliderSettings}>
                {Imagen_cancha.map((imagen, index) => (
                  <div key={index} className="relative w-full h-64">
                    <Image
                      src={imagen.Url_img}
                      alt={`Imagen de la Cancha ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg cursor-pointer"
                      onClick={() => window.open(imagen.Url_img, '_blank')}
                      />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="relative w-full h-64 mb-6">
              <Image
                src={Imagen_cancha[0]?.Url_img || '/default-image.jpg'}
                alt={`Imagen de la Cancha`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg cursor-pointer"
                onClick={() => window.open(Imagen_cancha[0]?.Url_img, '_blank')}
                />
            </div>
          )
        )}

        </div>
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
              {Caracteristicas && Object.keys(Caracteristicas)
                .filter((key) => Caracteristicas[key] === 'True')
                .map((key) => (
                  <tr key={key}>
                    <td className="border px-4 py-2">{key}</td>
                    <td className="border px-4 py-2 text-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <ul className={`mb-6 font-normal ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>{Superficie}, {Tamanio}</li>
            <li className='font-semibold text-lg mt-3'>$ {Precio_hora}</li>
          </ul>

          {user && ( // Mostrar el botón de Reservar solo si el usuario está logueado
            <Button className='w-full'>Reservar</Button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
