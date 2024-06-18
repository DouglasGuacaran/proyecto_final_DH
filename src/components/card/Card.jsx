import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaShareAlt } from "react-icons/fa"; // Importar el icono de compartir

const Card = ({ dataCancha }) => {
  const { theme } = useTheme();
  const { user } = useAuth(); // Acceder a la información del usuario
  const { id, Nombre, Precio_hora, Imagen_cancha } = dataCancha;
  const [shareVisible, setShareVisible] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Cargar el estado del favorito desde localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    if (favorites[user?.id]?.includes(id)) {
      setIsFavorite(true);
    }
  }, [user, id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);

    // Obtener los favoritos del localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    if (!favorites[user.id]) {
      favorites[user.id] = [];
    }

    if (isFavorite) {
      // Eliminar de favoritos
      favorites[user.id] = favorites[user.id].filter((fav) => fav.id !== id);
    } else {
      // Agregar a favoritos
      const { Nombre, Precio_hora, Imagen_cancha } = dataCancha; // Asegúrate de tener accesso a dataCancha aquí
      favorites[user.id].push({ id, Nombre, Precio_hora, Imagen_cancha });
    }

    // Guardar los favoritos actualizados en el localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const shareUrl = `http://localhost:3000/${id}`; // Cambiar a la URL real de tu sitio
  const shareTitle = `Reserva la cancha ${Nombre} por $${Precio_hora}`;

  return (
    <Link href={`/${id}`}>
      <div
        className={`w-full max-w-sm ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-200"} rounded-lg shadow flex flex-col justify-between`}
      >
        <div className=" flex max-w-full items-center justify-end mt-5 mb-5 mr-10">
          {user && ( // Mostrar el botón de Favorito solo si el usuario está logueado
            <button
              className={`focus:outline-none ${isFavorite ? "text-red-500" : "text-gray-500"}`}
              onClick={handleFavoriteClick}
            >
              <FontAwesomeIcon icon={faHeart} size="lg" />
            </button>
          )}
        </div>

        {Imagen_cancha.length > 1 ? (
          <Slider {...settings}>
            {Imagen_cancha.map((imagen, index) => (
              <div key={index} className="relative w-full h-64">
                <Image
                  src={imagen.Url_img}
                  alt={`Imagen de la Cancha ${index + 1}`}
                  layout="fill"
                  sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                  // width={500}
                  // height={300}
                  objectFit="cover"
                  className="rounded-t-lg cursor-pointer"
                  // onClick={() => window.open(imagen.Url_img, '_blank')}

                  onClick={() => window.open(imagen.Url_img, "_blank")}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="relative w-full h-64">
            <Image
              src={Imagen_cancha[0]?.Url_img || "/default-image.jpg"}
              alt={`Imagen de la Cancha`}
              layout="fill"
              // width={500}
              // height={300}
              objectFit="cover"
              className="rounded-t-lg cursor-pointer"
              // onClick={() => window.open(Imagen_cancha[0]?.Url_img, '_blank')}
            />
          </div>
        )}

        <div className="mx-5 my-5">
          <div className="flex justify-between items-center">
            <h5 className="text-lg font-semibold tracking-tight w-full truncate">
              {Nombre}
            </h5>
            <button
              onClick={() => setShareVisible(!shareVisible)}
              className="ml-2 text-black-500"
            >
              <FaShareAlt size={24} />
            </button>
          </div>

          {shareVisible && (
            <div className="flex justify-evenly my-2">
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          )}

          <div className="flex items-center justify-center mt-4">
            <span className="text-xl font-bold">${Precio_hora}</span>
          </div>
          <div className="flex justify-evenly mt-4">
            <Link href={`/${id}`}>
              <Button variant="outline">Detalle</Button>
            </Link>

            {/* {user && ( // Mostrar el botón de Reservar solo si el usuario está logueado
            // <Button>Reservar</Button>
          )} */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
