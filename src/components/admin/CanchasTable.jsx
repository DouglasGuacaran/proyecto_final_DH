'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import EditarCanchaModal from '@/components/modal/EditarCanchaModal';
import Image from 'next/image';
import Swal from 'sweetalert2';

const supabase = createClient();

export default function CanchasTable({ theme, canchas }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // paginador
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = canchas.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);
    const totalPages = Math.ceil(canchas.length / itemsPerPage);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCanchaId, setSelectedCanchaId] = useState(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        try {
            const { error: errorDeleteImagen } = await supabase
                .from('Imagen_cancha')
                .delete()
                .match({ Cancha_id: id });

            if (errorDeleteImagen) throw errorDeleteImagen;

            const { error: errorDeleteCaracteristicas } = await supabase
                .from('Cancha_Caracteristicas')
                .delete()
                .match({ Cancha_id: id });

            if (errorDeleteCaracteristicas) throw errorDeleteCaracteristicas;

            const { error: errorDeleteCancha } = await supabase
                .from('Cancha')
                .delete()
                .match({ id });

            // if (errorDeleteCancha) throw errorDeleteCancha;

            // // Actualiza el estado para eliminar la cancha de la lista
            // setCanchas((prevCanchas) => prevCanchas.filter((cancha) => cancha.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteClick = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(id).then(() => {
                    Swal.fire(
                        '¡Eliminado!',
                        'Tu archivo ha sido eliminado.',
                        'success'
                    );
                });
            }
        });
    };

    const handleEditClick = (canchaId) => {
        setSelectedCanchaId(canchaId);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedCanchaId(null);
    };

    const handleEditSuccess = () => {
        handleEditModalClose();
    };

    return (
        <>
            <div className="mt-10">
                <table className="w-full text-sm text-left">
                    <thead className={`text-sm uppercase ${theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-[#F4F4F4]'}`}>
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold">Nombre</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Tipo de Superficie</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Tamaño</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Precio de la hora</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Disciplina</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Imágenes</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((cancha) => (
                            <tr key={cancha.id}>
                                <td className="px-6 py-4 font-medium">{cancha.Nombre}</td>
                                <td className="px-6 py-4 font-medium">{cancha.Superficie.Nombre}</td>
                                <td className="px-6 py-4">{cancha.Tamanio}</td>
                                <td className="px-6 py-4">{cancha.Precio_hora}</td>
                                <td className="px-6 py-4">{cancha.Disciplina.Nombre}</td>
                                <td className="px-6 py-4">
                                    {cancha.Imagen_cancha && cancha.Imagen_cancha.length > 0 && (
                                        <Image
                                            src={cancha.Imagen_cancha[0].Url_img}
                                            alt={`Imagen de ${cancha.Nombre}`}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded"
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-row items-center justify-center">
                                        <Button
                                            onClick={() => handleEditClick(cancha.id)}
                                            size="icon"
                                            className={`border ${theme === 'dark' ? 'border-blue-600 text-blue-600 bg-gray-800 hover:bg-blue-600 hover:text-white' : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white'}`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-5 h-5"
                                            >
                                                <circle cx="12" cy="12" r="3"></circle>
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                            </svg>
                                        </Button>

                                        <Button
                                            onClick={() => handleDeleteClick(cancha.id)}
                                            size="icon"
                                            className={`border ${theme === 'dark' ? 'border-red-600 text-red-600 bg-gray-800 hover:bg-red-600 hover:text-white' : 'border-red-600 text-red-600 bg-white hover:bg-red-600 hover:text-white'}`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <EditarCanchaModal
                    isOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                    canchaId={selectedCanchaId}
                    onEdit={handleEditSuccess}
                    theme={theme}
                />
            </div>
            <div className="flex justify-center mt-6">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`m-3 px-3 py-2 ml-0 leading-tight ${theme === 'dark' ?
                            'bg-gray-800 text-white border-gray-700 hover:bg-gray-600' :
                            'bg-white text-black border-gray-300 hover:bg-gray-200 hover:text-gray-700'
                            } rounded-lg`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    );
}