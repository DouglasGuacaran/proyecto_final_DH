'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useReservas } from '@/context/ReservasProvider';
import { useCanchas } from '@/context/CanchasProvider';
import { useUsuarios } from '@/context/UsuariosProvider';
import { useTheme } from '@/context/ThemeContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function ManejarReservas() {
    const { theme } = useTheme();
    const { reservas, fetchReservas } = useReservas();
    const { canchas } = useCanchas();
    const { usuarios } = useUsuarios();
    const [newReserva, setNewReserva] = useState({
        Cancha_id: '',
        Usuario_id: '',
        Fecha_hora_inicio: '',
        Fecha_hora_fin: '',
        Estado: '',
    });
    const [errors, setErrors] = useState({});
    const [supabaseDeleteError, setSupabaseDeleteError] = useState('');
    const [supabaseErrors, setSupabaseErrors] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReserva((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (event) => {
        setNewReserva({ Cancha_id: event.target.value });
      };
    // const handleSelectChange = (name,value) => {
    //     setNewReserva((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (newReserva.Cancha_id === '') newErrors.Cancha_id = 'Por favor, seleccione una cancha.';
        if (newReserva.Usuario_id === '') newErrors.Usuario_id = 'Por favor, seleccione un usuario.';
        if (newReserva.Fecha_hora_inicio === '') newErrors.Fecha_hora_inicio = 'Por favor, ingrese la fecha y hora de inicio.';
        if (newReserva.Fecha_hora_fin === '') newErrors.Fecha_hora_fin = 'Por favor, ingrese la fecha y hora de fin.';
        if (newReserva.Estado === '') newErrors.Estado = 'Por favor, ingrese el estado.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const { error } = await supabase
            .from('Reserva')
            .insert([newReserva]);

        if (error) {
            setSupabaseErrors('Error al insertar la reserva.');
        } else {
            setNewReserva({
                Cancha_id: '',
                Usuario_id: '',
                Fecha_hora_inicio: '',
                Fecha_hora_fin: '',
                Estado: '',
            });
            fetchReservas();
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('Reserva')
            .delete()
            .eq('id', id);

        if (error) {
            setSupabaseDeleteError('Error al eliminar la reserva.');
        } else {
            fetchReservas();
        }
    };

    return (
        <>
            <div className={`md:hidden min-h-screen flex items-center justify-center flex-col ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 text-red-600 mb-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>

                <h2 className="text-center">
                    El panel de administrador está disponible únicamente en versión
                    desktop
                </h2>
            </div>
            <main className={`hidden md:block text-sm sm:text-base md:text-lg lg:text-xl min-h-screen p-4 mt-32 flex-col ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <h1 className="text-2xl font-semibold ml-6 antialiased">
                    Editar Reservas
                </h1>
                <div className="mt-10 px-6">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-sm uppercase ${theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-[#F4F4F4]'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Cancha
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Usuario
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Fecha y Hora de Inicio
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Fecha y Hora de Fin
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Estado
                                </th>
                                /
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id} className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <td className="px-6 py-4 font-medium">{canchas.find(cancha => cancha.id === reserva.Cancha_id)?.Nombre}</td>
                                    <td className="px-6 py-4">{usuarios.find(usuario => usuario.id === reserva.Usuario_id)?.Nombre}</td>
                                    <td className="px-6 py-4">{reserva.Fecha_hora_inicio}</td>
                                    <td className="px-6 py-4">{reserva.Fecha_hora_fin}</td>
                                    <td className="px-6 py-4">{reserva.Estado}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <Button
                                            onClick={() => handleDelete(reserva.id)}
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
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {supabaseDeleteError && (
                    <h2 className="text-xs text-red-600 text-center my-6">
                        {supabaseDeleteError}
                    </h2>
                )}
                <div className="m-4">
                    <h2 className="text-xl font-semibold ml-6 antialiased mt-20 mb-10">
                        Ingresar Nueva Reserva
                    </h2>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl ml-10 flex flex-col gap-5"
                >
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Cancha_id">Cancha</Label>
                        <Select
                            name="Cancha_id"
                            value={newReserva.Cancha_id}
                            onValueChange={handleSelectChange}
                        >
                            <SelectTrigger
                                className={`${
                                    errors.Cancha_id ? 'border border-red-600' : ''
                                }`}
                            >
                                <SelectValue>
                                    {newReserva.Cancha_id ? canchas.find((cancha) => cancha.id === newReserva.Cancha_id)?.Nombre : 'Seleccione una cancha'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {canchas.map((cancha) => (
                                    <SelectItem key={cancha.id.key} value={cancha.id}>{cancha.Nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.Cancha_id && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Cancha_id}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Usuario_id">Usuario</Label>
                        <Select
                            name="Usuario_id"
                            value={newReserva.Usuario_id}
                            onValueChange={(value) => handleSelectChange('Usuario_id', value)}
                        >
                            <SelectTrigger
                                className={`${
                                    errors.Usuario_id ? 'border border-red-600' : ''
                                }`}
                            >
                                <SelectValue>
                                    {newReserva.Usuario_id ? usuarios.find((usuario) => usuario.id === newReserva.Usuario_id)?.Nombre : 'Seleccione un usuario'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {usuarios.map((usuario) => (
                                    <SelectItem key={usuario.id} value={usuario.id}>{usuario.Nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.Usuario_id && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Usuario_id}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Fecha_hora_inicio">Fecha y Hora de Inicio</Label>
                        <Input
                            type="datetime-local"
                            name="Fecha_hora_inicio"
                            value={newReserva.Fecha_hora_inicio}
                            onChange={handleInputChange}
                            className={`${errors.Fecha_hora_inicio ? 'border border-red-600' : ''}`}
                        />
                        {errors.Fecha_hora_inicio && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Fecha_hora_inicio}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Fecha_hora_fin">Fecha y Hora de Fin</Label>
                        <Input
                            type="datetime-local"
                            name="Fecha_hora_fin"
                            value={newReserva.Fecha_hora_fin}
                            onChange={handleInputChange}
                            className={`${errors.Fecha_hora_fin ? 'border border-red-600' : ''}`}
                        />
                        {errors.Fecha_hora_fin && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Fecha_hora_fin}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Estado">Estado</Label>
                        <Input
                            type="text"
                            name="Estado"
                            value={newReserva.Estado}
                            onChange={handleInputChange}
                            className={`${errors.Estado ? 'border border-red-600' : ''}`}
                        />
                        {errors.Estado && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Estado}
                            </span>
                        )}
                    </div>
                    <Button className="my-5 w-[180px]" type="submit">
                        Agregar Reserva
                    </Button>
                </form>

                {supabaseErrors && (
                    <span className="text-xs text-red-600 -mt-10 ml-10">
                        {supabaseErrors}
                    </span>
                )}
                <Toaster />
            </main>
        </>
    );
}