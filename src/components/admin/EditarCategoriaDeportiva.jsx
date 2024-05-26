'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/context/ThemeContext';
import { createClient } from '@/utils/supabase/client';

export default function EditarCategoriaDeportiva() {
    const { theme } = useTheme();
    const [categorias, setCategorias] = useState([]);
    const [newCategoria, setNewCategoria] = useState('');
    const [errors, setErrors] = useState('');
    const [supabaseErrors, setSupabaseErrors] = useState('');
    const [supabaseDeleteError, setSupabaseDeleteError] = useState('');

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('Disciplina')
            .select('*');

        if (error) {
            console.error('Error al obtener las categorías:', error);
        } else {
            setCategorias(data);
        }
    };

    const handleInputChange = (e) => {
        setNewCategoria(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newCategoria === '') {
            setErrors('Por favor, ingrese el nombre de la categoría.');
            return;
        }

        const supabase = createClient();
        const { error } = await supabase
            .from('Disciplina')
            .insert([{ Nombre: newCategoria }]);

        if (error) {
            setSupabaseErrors('Error al insertar la categoría.');
        } else {
            setNewCategoria('');
            fetchCategorias();
        }
    };

    const handleDelete = async (id) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('Disciplina')
            .delete()
            .eq('id', id);

        if (error) {
            setSupabaseDeleteError('Error al eliminar la categoría.');
        } else {
            fetchCategorias();
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
                    Editar Categorías Deportivas
                </h1>
                <div className="mt-10 px-6">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-sm uppercase ${theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-[#F4F4F4]'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((categoria) => (
                                <tr key={categoria.id} className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <td className="px-6 py-4 font-medium">{categoria.Nombre}</td>
                                    <td className="px-6 py-4">
                                        <Button
                                            onClick={() => handleDelete(categoria.id)}
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
                        Agregar Nueva Categoría Deportiva
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="max-w-xl ml-10 flex flex-col gap-5">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Nombre">Nombre</Label>
                        <Input
                            type="text"
                            name="Nombre"
                            value={newCategoria}
                            onChange={handleInputChange}
                            className={`${errors ? 'border border-red-600' : ''}`}
                        />
                        {errors && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors}
                            </span>
                        )}
                    </div>
                    <Button className="my-5 w-[180px]" type="submit">
                        Agregar Categoría
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
