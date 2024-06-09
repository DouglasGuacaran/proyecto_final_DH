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
import ModalReservas from '@/components/modal/ModalReservas';
import { useUsuarios } from '@/context/UsuariosProvider';
import { FaShareAlt } from 'react-icons/fa'; // Importar el icono de compartir
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

export default function Page() {
  const { id } = useParams();
  const [cancha, setCancha] = useState({});
  const { theme } = useTheme();
  const { user } = useAuth(); // Accede a la información del usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Estado para la visibilidad del modal de compartir

  const [usuarioId, setUsuarioId] = useState(null);
  const { supabase } = useUsuarios();

  useEffect(() => {
    const fetchUsuarioId = async () => {
      const supabase = createClient();
      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log("Authenticated user:", user);

      if (userError) {
        console.error('Error fetching authenticated user:', userError);
        return;
      }

      if (user && user.user && user.user.id) {
        const { data, error } = await supabase
          .from('Usuario')
          .select('id')
          .eq('uid', user.user.id)
          .single();

        if (error) {
          console.error('Error fetching usuario ID:', error);
        } else {
          setUsuarioId(data.id);
          console.log("Fetched usuario ID:", data.id);
        }
      } else {
        console.error('User data is not in expected format:', user);
      }
    };

    fetchUsuarioId();
  }, []);


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

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleReserve = async ({ startDateTime, endDateTime }) => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('Reserva')
      .insert([
        {
          Cancha_id: cancha.id,
          Usuario_id: usuarioId,
          Fecha_hora_inicio: startDateTime,
          Fecha_hora_fin: endDateTime,
          Estado: 'Reservado'
        }
      ])
      .select()

    console.log(usuarioId);
    console.log(cancha.id);
    console.log(startDateTime);
    console.log(endDateTime);
    if (error) {
      console.error('Error creating reservation:', error);
    } else {
      console.log('Reservation created:', data);
    }
  };

  const shareUrl = `http://localhost:3000/${id}`; // Cambiar a la URL real de tu sitio
  const shareTitle = `Reserva la cancha ${Nombre} por $${Precio_hora}`;

  const handleShareModalOpen = () => setIsShareModalOpen(true);
  const handleShareModalClose = () => setIsShareModalOpen(false);

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
          <div className="flex justify-between items-center">
            <h6 className={`mb-4 text-center text-xl font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'}`}>Características</h6>
            <button onClick={handleShareModalOpen} className="ml-2 text-black-500">
              <FaShareAlt size={24} />
            </button>
          </div>

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
            <Button className='w-full' onClick={handleModalOpen}>Reservar</Button>
          )}
        </div>
      </main>
      <Footer />

      <ModalReservas isOpen={isModalOpen} onClose={handleModalClose} onReserve={handleReserve}
        canchaName={Nombre}>
        <h2 className="text-2xl font-bold mb-4 text-center">Reserva en {Nombre}</h2>
      </ModalReservas>

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 bg-white rounded-lg shadow-lg ${theme === 'dark' ? 'text-black' : ''}`}>
            <h3 className="text-xl mb-4">Compartir {Nombre}</h3>
            <div className="relative w-full h-64 mb-4">
              <Image
                src={Imagen_cancha[0]?.Url_img || '/default-image.jpg'}
                alt={`Imagen de la Cancha`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex justify-around">
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
            </div>
            <button onClick={handleShareModalClose} className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
