import { useTheme } from '@/context/ThemeContext';
import { Button } from '../ui/button';
import Link from 'next/link';

const Card = ({ dataCancha }) => {
  const { theme } = useTheme();
  const { id, Nombre, Precio_hora, imagen, Superficie, Tamanio } = dataCancha;

  return (
    <div className={`w-full max-w-sm ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'} rounded-lg shadow flex flex-col justify-between`}>
      <img className="rounded-t-lg h-64 w-full object-cover" src={imagen} alt={Nombre} />

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
          <Button>Reservar</Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
