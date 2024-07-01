import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';
import { useReservas } from '@/context/ReservasProvider';

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
    handleTimeSlotClick,
    checkIfTimeSlotIsOccupied,
    reservationsByDay,
    horarios,
    showCorrelativeMessage,
    selectedDay,
}) => {
    const { selectedTimeSlots } = useReservas();
    const [nombreContacto, setNombreContacto] = useState(usuarioNombre);
    const [telefonoContacto, setTelefonoContacto] = useState(usuarioTelefono);
    const { theme } = useTheme();

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
                    const [dia, mes, año] = selectedDay.split('-');
                    const fechaFormateada = `${año}-${mes}-${dia}`;

                    const startTime = selectedTimeSlots[0].split(' - ')[0];
                    const endTime = selectedTimeSlots[selectedTimeSlots.length - 1].split(' - ')[1];
                    const fecha_hora_inicio = `${fechaFormateada} ${startTime}:00`;
                    const fecha_hora_fin = `${fechaFormateada} ${endTime}:00`;

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
                            text: 
                                'Reserva realizada en ' +
                                canchaName +
                                ' el ' +
                                selectedDay +
                                ' a las ' +
                                selectedTimeSlots[0] +
                                'hs.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                        onClose();
                    })
                    .catch((error) => {
                        console.error('Error al realizar la reserva:', error);
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

    const formatUserName = (nombre) => nombre.split(' ')[0];

    const handleNombreContactoChange = (e) => setNombreContacto(e.target.value);
    const handleTelefonoContactoChange = (e) => setTelefonoContacto(e.target.value);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center mt-20 overflow-auto">
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 my-10 ${theme === 'dark' ? 'text-white' : 'text-black'} max-h-full overflow-y-auto mt-20`}
            >
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
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-700"
                        value={nombreContacto}
                        onChange={handleNombreContactoChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Teléfono de contacto</label>
                    <input
                        type="tel"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none dark:bg-gray-700"
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
                                    const isOccupied = checkIfTimeSlotIsOccupied(
                                        horario,
                                        selectedDay,
                                        reservationsByDay
                                    );
                                    const isSelected = selectedTimeSlots && selectedTimeSlots.includes(horario);

                                    const buttonClasses = [
                                        "p-2",
                                        "rounded-lg",
                                        "transition",
                                        "duration-150",
                                        "ease-in-out",
                                        "transform",
                                        "hover:scale-105",
                                        "shadow-md",
                                        "hover:shadow-lg",
                                        isOccupied
                                            ? "bg-red-500 text-white cursor-not-allowed"
                                            : isSelected
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-300 text-black hover:bg-gray-400",
                                    ].join(" ");

                                    return (
                                        <button
                                            key={horario}
                                            disabled={isOccupied}
                                            className={buttonClasses}
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
