import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';

const ModalReservas = ({
    isOpen,
    onClose,
    onReserve,
    canchaName,
    canchaLocalidad,
    canchaDireccion,
    canchaCaracteristicas,
    usuarioNombre,
    usuarioTelefono,
    selectedTimeSlots,
    handleTimeSlotClick,
    checkIfTimeSlotIsOccupied,
    reservationsByDay,
    horarios,
    showCorrelativeMessage,
    selectedDay,
    closeModal,
}) => {
    const [nombreContacto, setNombreContacto] = useState(usuarioNombre);
    const [telefonoContacto, setTelefonoContacto] = useState(usuarioTelefono);

    useEffect(() => {
        setNombreContacto(usuarioNombre);
        setTelefonoContacto(usuarioTelefono);
    }, [usuarioNombre, usuarioTelefono]);

    const handleReserve = () => {
        if (selectedDay && selectedTimeSlots.length > 0) {
            Swal.fire({
                title: '¿Estás seguro de reservar?',
                text: 'Confirma que deseas realizar la reserva.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, reservar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí definimos fecha_hora_inicio y fecha_hora_fin
                    const [dia, mes, año] = selectedDay.split('-');
                    const fechaFormateada = `${año}-${mes}-${dia}`;

                    const startTime = selectedTimeSlots[0];
                    const endTime =
                        selectedTimeSlots[selectedTimeSlots.length - 1];
                    const endTimePlusOneHour = `${parseInt(endTime.split(':')[0], 10) + 1}:00`;

                    const fecha_hora_inicio = `${fechaFormateada} ${startTime}:00`;
                    const fecha_hora_fin = `${fechaFormateada} ${endTimePlusOneHour}:00`;

                    onReserve({
                        startDateTime: fecha_hora_inicio,
                        endDateTime: fecha_hora_fin,
                        nombreContacto,
                        telefonoContacto,
                    })
                        .then(() => {
                            Swal.fire({
                                title: '¡Reserva exitosa!',
                                text: 'Tu reserva se ha realizado correctamente.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                            });
                            closeModal();
                        })
                        .catch(() => {
                            Swal.fire({
                                title: 'Error',
                                text: 'Hubo un problema al realizar la reserva. Inténtalo nuevamente.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                            });
                        });
                }
            });
        } else {
            alert('Por favor, selecciona una fecha y un horario.');
        }
    };

    const formatUserName = (nombre) => {
        return nombre.split(' ')[0];
    };
    const handleNombreContactoChange = (e) => {
        setNombreContacto(e.target.value);
    };

    const handleTelefonoContactoChange = (e) => {
        setTelefonoContacto(e.target.value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white hover:bg-red-800 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                        X
                    </button>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-left">
                    Hola {formatUserName(usuarioNombre)}, finaliza tu reserva!
                </h2>

                <h3 className="text-lg font-bold mt-5 mb-5">
                    Detalles de tu reserva
                </h3>
                <div className="space-y-2">
                    <p>
                        <strong>Cancha:</strong> {canchaName}
                    </p>
                    <p>
                        <strong>Ubicación:</strong> {canchaDireccion},{' '}
                        {canchaLocalidad}
                    </p>
                </div>

                <h3 className="text-lg font-bold mt-5 mb-5">
                    Datos de contacto
                </h3>

                <div className="mb-4">
                    <label className="block mb-2">Nombre de contacto</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        value={nombreContacto}
                        onChange={handleNombreContactoChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Teléfono de contacto</label>
                    <input
                        type="tel"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                        value={telefonoContacto}
                        onChange={handleTelefonoContactoChange}
                    />
                </div>

                <h3 className="text-lg font-bold mt-5 mb-5">Caracteristicas</h3>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    {canchaCaracteristicas
                        .slice(0, 4)
                        .map((caracteristica, index) => (
                            <p key={index}>{caracteristica}</p>
                        ))}
                </div>

                <h3 className="text-lg font-bold mt-5 mb-5">Fecha y hora</h3>
                <div className="flex">
                    <div>
                        <span>Dia:</span> {selectedDay}
                    </div>
                </div>

                <div>
                    <div>
                        <h3 className="text-center">Horarios</h3>
                        <div className="grid grid-cols-5 gap-4 mb-5 mt-5">
                            {horarios && horarios.length > 0 ? (
                                horarios.map((horario) => {
                                    const isOccupied =
                                        checkIfTimeSlotIsOccupied(
                                            horario,
                                            selectedDay,
                                            reservationsByDay
                                        );
                                    return (
                                        <button
                                            key={horario}
                                            disabled={isOccupied} // Deshabilita el botón si el horario está ocupado
                                            className={`p-2 rounded-lg transition duration-150 ease-in-out transform hover:scale-105 ${isOccupied ? 'bg-red-500 text-white cursor-not-allowed' : selectedTimeSlots.includes(horario) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-gray-400'} shadow-md hover:shadow-lg ${isOccupied ? 'bg-red-500 text-white' : selectedTimeSlots.includes(horario) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                                            onClick={() =>
                                                !isOccupied &&
                                                handleTimeSlotClick(horario)
                                            }
                                        >
                                            {horario}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 text-center">
                                    Cargando horarios...
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {showCorrelativeMessage && (
                            <div className="text-center mt-4 text-red-500">
                                Solo se permite elegir horarios correlativos.
                            </div>
                        )}
                    </div>
                </div>
                <div className=" text-center">
                    <Button className="" onClick={handleReserve}>
                        Confirmar reserva
                    </Button>
                    <span className="block text-sm text-gray-500 sm:text-center mt-8">
                        <a href="/policies">Ver Políticas</a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ModalReservas;
