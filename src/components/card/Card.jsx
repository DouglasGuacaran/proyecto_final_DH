import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Card = ({ dataCancha }) => {
  const { theme } = useTheme();
  const { user } = useAuth(); // Acceder a la información del usuario
  const { id, Nombre, Precio_hora, Imagen_cancha } = dataCancha;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className={`w-full max-w-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'} rounded-lg shadow flex flex-col justify-between`}>
      {Imagen_cancha.length > 1 ? (
        <Slider {...settings}>
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
      ) : (
        <div className="relative w-full h-64">
          <Image
            src={Imagen_cancha[0]?.Url_img || '/default-image.jpg'}
            alt={`Imagen de la Cancha`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg cursor-pointer"
            onClick={() => window.open(Imagen_cancha[0]?.Url_img, '_blank')}
          />
        </div>
      )}

      <div className="mx-5 my-5">
        <h5 className="text-lg font-semibold tracking-tight w-full truncate ">
          {Nombre}
        </h5>

        <div className="flex items-center justify-center mt-4">
          <span className="text-xl font-bold">
            ${Precio_hora}
          </span>
        </div>
        <div className="flex justify-evenly mt-4">
          <Link href={`/${id}`}>
            <Button variant="outline">
              Detalle
            </Button>
          </Link>
          {user && ( // Mostrar el botón de Reservar solo si el usuario no está logueado
            <Button>Reservar</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
