import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/context/ThemeContext';
import { createClient } from '@/utils/supabase/client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function EditarUsuarios() {
    const { theme } = useTheme();
    const [usuarios, setUsuarios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [newUsuario, setNewUsuario] = useState({
        Nombre: '',
        Username: '',
        Correo: '',
        Telefono: '',
        Rol: '',
        Direccion: '',
        DocumentoDeIdentificacion: ''
    });
    const [errors, setErrors] = useState({});
    const [supabaseErrors, setSupabaseErrors] = useState('');
    const [supabaseDeleteError, setSupabaseDeleteError] = useState('');

    useEffect(() => {
        fetchUsuarios();
        fetchReservas();
    }, []);

    const fetchUsuarios = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('Usuario')
            .select('*');

        if (error) {
            console.error('Error al obtener los usuarios:', error);
        } else {
            setUsuarios(data);
        }
    };

    const fetchReservas = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('Reserva')
            .select(`
                *,
                Cancha (Nombre),
                Usuario (Nombre)
            `);

        if (error) {
            console.error('Error al obtener las reservas:', error);
        } else {
            setReservas(data);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (newUsuario.Nombre === '') newErrors.Nombre = 'Por favor, ingrese el nombre.';
        if (newUsuario.Username === '') newErrors.Username = 'Por favor, ingrese el username.';
        if (newUsuario.Correo === '') newErrors.Correo = 'Por favor, ingrese el correo.';
        if (newUsuario.Telefono === '') newErrors.Telefono = 'Por favor, ingrese el teléfono.';
        if (newUsuario.Rol === '') newErrors.Rol = 'Por favor, seleccione un rol.';
        if (newUsuario.Direccion === '') newErrors.Direccion = 'Por favor, ingrese la dirección.';
        if (newUsuario.DocumentoDeIdentificacion === '') newErrors.DocumentoDeIdentificacion = 'Por favor, ingrese el documento de identificación.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const supabase = createClient();
        const { error } = await supabase
            .from('Usuario')
            .insert([newUsuario]);

        if (error) {
            setSupabaseErrors('Error al insertar el usuario.');
        } else {
            setNewUsuario({
                Nombre: '',
                Username: '',
                Correo: '',
                Telefono: '',
                Rol: '',
                Direccion: '',
                DocumentoDeIdentificacion: ''
            });
            fetchUsuarios();
        }
    };

    const handleDelete = async (id) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('Usuario')
            .delete()
            .eq('id', id);

        if (error) {
            setSupabaseDeleteError('Error al eliminar el usuario.');
        } else {
            fetchUsuarios();
        }
    };

    const handleUpdate = async (id, updatedData) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('Usuario')
            .update(updatedData)
            .eq('id', id);

        if (error) {
            setSupabaseErrors('Error al actualizar el usuario.');
        } else {
            fetchUsuarios();
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
                    Editar Usuarios
                </h1>
                <div className="mt-10 px-6">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-sm uppercase ${theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-[#F4F4F4]'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Correo
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Teléfono
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Rol
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Dirección
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Documento de Identificación
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <td className="px-6 py-4 font-medium">{usuario.Nombre}</td>
                                    <td className="px-6 py-4">{usuario.Username}</td>
                                    <td className="px-6 py-4">{usuario.Correo}</td>
                                    <td className="px-6 py-4">{usuario.Telefono}</td>
                                    <td className="px-6 py-4">{usuario.Rol}</td>
                                    <td className="px-6 py-4">{usuario.Direccion}</td>
                                    <td className="px-6 py-4">{usuario.DocumentoDeIdentificacion}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <Button
                                            onClick={() => handleDelete(usuario.id)}
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
                                        <Button
                                            onClick={() => handleUpdate(usuario.id, { Rol: usuario.Rol === 'Usuario' ? 'Admin' : 'Usuario' })}
                                            size="icon"
                                            className={`border ${theme === 'dark' ? 'border-blue-600 text-blue-600 bg-gray-800 hover:bg-blue-600 hover:text-white' : 'border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white'}`}
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
                                                    d="M19.25 6.75A2.25 2.25 0 0 0 17 4.5H7A2.25 2.25 0 0 0 4.75 6.75V9h14.5V6.75zM19.25 10.5h-14.5V17.25A2.25 2.25 0 0 0 7 19.5h10a2.25 2.25 0 0 0 2.25-2.25V10.5z"
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
                        Ingresar Nuevo Usuario
                    </h2>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl ml-10 flex flex-col gap-5"
                >
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Nombre">Nombre</Label>
                        <Input
                            type="text"
                            name="Nombre"
                            value={newUsuario.Nombre}
                            onChange={handleInputChange}
                            className={`${errors.Nombre ? 'border border-red-600' : ''}`}
                        />
                        {errors.Nombre && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Nombre}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Username">Username</Label>
                        <Input
                            type="text"
                            name="Username"
                            value={newUsuario.Username}
                            onChange={handleInputChange}
                            className={`${errors.Username ? 'border border-red-600' : ''}`}
                        />
                        {errors.Username && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Username}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Correo">Correo</Label>
                        <Input
                            type="email"
                            name="Correo"
                            value={newUsuario.Correo}
                            onChange={handleInputChange}
                            className={`${errors.Correo ? 'border border-red-600' : ''}`}
                        />
                        {errors.Correo && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Correo}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Telefono">Teléfono</Label>
                        <Input
                            type="text"
                            name="Telefono"
                            value={newUsuario.Telefono}
                            onChange={handleInputChange}
                            className={`${errors.Telefono ? 'border border-red-600' : ''}`}
                        />
                        {errors.Telefono && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Telefono}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Rol">Rol</Label>
                        <Select
                        >
                            <SelectTrigger
                                className={`${
                                    errors.Rol ? 'border border-red-600' : 'w-full'
                                }`}
                            >
                                <SelectValue placeholder="Seleccione un Rol">
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem  value="Admin">Admin</SelectItem>
                                <SelectItem  value="Usuario">Usuario</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.Rol && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Rol}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Direccion">Dirección</Label>
                        <Input
                            type="text"
                            name="Direccion"
                            value={newUsuario.Direccion}
                            onChange={handleInputChange}
                            className={`${errors.Direccion ? 'border border-red-600' : ''}`}
                        />
                        {errors.Direccion && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Direccion}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="DocumentoDeIdentificacion">Documento de Identificación</Label>
                        <Input
                            type="text"
                            name="DocumentoDeIdentificacion"
                            value={newUsuario.DocumentoDeIdentificacion}
                            onChange={handleInputChange}
                            className={`${errors.DocumentoDeIdentificacion ? 'border border-red-600' : ''}`}
                        />
                        {errors.DocumentoDeIdentificacion && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.DocumentoDeIdentificacion}
                            </span>
                        )}
                    </div>
                    <Button className="my-5 w-[180px]" type="submit">
                        Agregar Usuario
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
    