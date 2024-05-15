import React, { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

const Card = ({ dataCancha }) => {
  const { id, Nombre, Direccion, Precio_hora, imagen, Superficie, Tamanio } =
    dataCancha;

  // const [modalOpen, setModalOpen] = useState(false);

  // const openModal = () => {
  //   setModalOpen(true);
  // };

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

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
      {/* {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg shadow-xl z-50 relative flex flex-col items-center">
            <button
              onClick={closeModal}
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold mb-4">{Nombre}</h2>
            <img
              className="w-full h-64 object-cover rounded-lg"
              src={imagen}
              alt={Nombre}
            />
            <p>{`Dirección: ${Direccion}`}</p>
            <p>{`Superficie: ${Superficie}`}</p>
            <p>{`Tamaño: ${Tamanio}`}</p>
            <p>{`Valor hora: $${Precio_hora}`}</p>
            <button
              onClick={closeModal}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 mx-auto block"
            >
              Cerrar
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Card;
