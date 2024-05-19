import { Button } from '../ui/button';
import Link from 'next/link';

const Card = ({ dataCancha }) => {
  const { id, Nombre, Precio_hora, imagen, Superficie, Tamanio } =
    dataCancha;

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-between">
      <img className="rounded-t-lg h-32" src={imagen} alt={Nombre} />

      <div className="mx-5 my-5">
        <h5 className="text-lg font-semibold tracking-tight text-gray-900 w-full truncate ">
          {Nombre}
        </h5>

        <div className="flex items-center justify-center mt-4">
          <span className="text-xl font-bold text-gray-900">
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
