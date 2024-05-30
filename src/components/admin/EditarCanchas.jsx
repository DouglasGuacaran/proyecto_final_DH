'use client';

import { Toaster } from '@/components/ui/toaster';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCanchas } from '@/context/CanchasProvider';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Image from "next/image";
import { useTheme } from '@/context/ThemeContext';

// Inicializar cliente de Supabase
const supabase = createClient();

export default function Page() {
    const { theme } = useTheme();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const { canchas, fetchCanchas } = useCanchas();
    const [newCancha, setNewCancha] = useState({
        Nombre: '',
        Superficie: '',
        Tamanio: '',
        Precio_hora: '',
        Caracteristicas: '',
        Disciplina_id: '',
    });
    const [errors, setErrors] = useState({
        Nombre: '',
        Superficie: '',
        Tamanio: '',
        Precio_hora: '',
        Caracteristicas: '',
        Disciplina_id: '',
        Imagen: '',
    });
    const [supabaseErrors, setSupabaseErrors] = useState({
        canchaExiste: '',
        insertError: '',
        uploadError: '',
        publicUrlError: '',
        imageError: '',
    });
    const [supabaseDeleteError, setSupabaseDeleteError] = useState('');
    const { toast } = useToast();

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...filesArray]);
    
        const previewUrls = filesArray.map(file => URL.createObjectURL(file));
        setPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
    };

    const handleRemoveImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
    
        setFiles(newFiles);
        setPreviews(newPreviews);
    };

    // Manejar el cambio en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCancha((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar cambio en el select
    const handleSelectChange = (value) => {
        setNewCancha((prevState) => ({
            ...prevState,
            Disciplina_id:value,
        }));
    };

    // Función para agregar una nueva cancha
    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {
            Nombre: '',
            Superficie: '',
            Tamanio: '',
            Precio_hora: '',
            Caracteristicas: '',
            Disciplina_id: '',
            Imagen: '',
        };

        // validaciones generales
        if (newCancha.Nombre === '') {
            newErrors.Nombre = 'Por favor, ingrese un nombre para la cancha.';
        }
        if (newCancha.Superficie === '') {
            newErrors.Superficie = 'Por favor, ingrese una superficie para la cancha.';
        }
        if (newCancha.Tamanio === '') {
            newErrors.Tamanio = 'Por favor, ingrese un tamaño para la cancha.';
        }
        if (newCancha.Precio_hora === '') {
            newErrors.Precio_hora = 'Por favor, ingrese un precio para la cancha.';
        }
        if (newCancha.Caracteristicas === '') {
            newErrors.Caracteristicas = 'Por favor, ingrese al menos una característica de la cancha.';
        }
        if (newCancha.Disciplina_id === '') {
            newErrors.Disciplina_id = 'Por favor, seleccione una disciplina para la cancha.';
        }

        // Validación de la imagen
        if (files.length === 0) {
            newErrors.Imagen = 'Por favor, seleccione al menos una imagen para la cancha.';
        }

        if (
            newErrors.Nombre ||
            newErrors.Superficie ||
            newErrors.Tamanio ||
            newErrors.Precio_hora ||
            newErrors.Caracteristicas ||
            newErrors.Disciplina_id ||
            newErrors.Imagen
        ) {
            setErrors(newErrors);
            return;
        }

        setErrors({
            Nombre: '',
            Superficie: '',
            Tamanio: '',
            Precio_hora: '',
            Caracteristicas: '',
            Disciplina_id: '',
            Imagen: '',
        });

        let newSupabaseErrors = {
            canchaExiste: '',
            insertError: '',
            uploadError: '',
            publicUrlError: '',
            imageError: '',
        };

        // Verificación de nombre existente
        const { data: existingCancha, error: existingError } = await supabase
            .from('Cancha')
            .select('Nombre')
            .eq('Nombre', newCancha.Nombre);

        if (existingError || existingCancha.length > 0) {
            newSupabaseErrors.canchaExiste = 'Una cancha con este nombre ya existe';
            setSupabaseErrors(newSupabaseErrors);
            return;
        }

        // Inserción de nueva cancha
        const { data: newCanchaData, error: insertError } = await supabase
            .from('Cancha')
            .insert([{ ...newCancha }])
            .select();

        if (insertError) {
            newSupabaseErrors.insertError = 'Error al insertar la cancha';
            setSupabaseErrors(newSupabaseErrors);
            return;
        }

        // Subir imágenes
        const urls = [];
        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('imagenes_canchas')
                .upload(fileName, file);

            if (uploadError) {
                newSupabaseErrors.uploadError = 'Error al subir la imagen';
                setSupabaseErrors(newSupabaseErrors);
                return;
            }

            // Obtener URL pública de la imagen
            const {
                data: { publicUrl },
                error: publicUrlError,
            } = supabase.storage.from('imagenes_canchas').getPublicUrl(fileName);

            if (publicUrlError) {
                newSupabaseErrors.publicUrlError = 'Error al obtener la URL pública de la imagen';
                setSupabaseErrors(newSupabaseErrors);
                return;
            }

            urls.push(publicUrl);
        }

        // Inserción de imágenes
        const { error: imageError } = await supabase
            .from('Imagen_cancha')
            .insert(urls.map(url => ({ Cancha_id: newCanchaData[0].id, Url_img: url })));

        if (imageError) {
            newSupabaseErrors.imageError = 'Error al insertar datos de imagen';
            setSupabaseErrors(newSupabaseErrors);
            return;
        }

        toast({
            title: 'Nueva Cancha',
            description: `La cancha ${newCancha.Nombre} fue agregada correctamente!`,
        });

        setSupabaseErrors({
            canchaExiste: '',
            insertError: '',
            uploadError: '',
            publicUrlError: '',
            imageError: '',
        });
        setNewCancha({
            Nombre: '',
            Superficie: '',
            Tamanio: '',
            Precio_hora: '',
            Caracteristicas: '',
            Disciplina_id: '',
        });
        setFiles([]);
        fetchCanchas();
    };

    // Función para eliminar una cancha
    const handleDelete = async (id) => {
        try {
            // 1: Buscamos las url de las imagenes
            const { data: images, error: imagesError } = await supabase
                .from('Imagen_cancha')
                .select('Url_img')
                .eq('Cancha_id', id);

            if (imagesError) {
                setSupabaseDeleteError('Error al obtener las imágenes de la cancha.');
                return;
            }

            // 2: Eliminamos las imagenes del storage
            const deletePromises = images.map((image) => {
                // Extract the image file name from the URL
                const urlParts = image.Url_img.split('/');
                const fileName = urlParts[urlParts.length - 1];
                return supabase.storage.from('imagenes_canchas').remove([fileName]);
            });

            const deleteResults = await Promise.all(deletePromises);
            const storageErrors = deleteResults.filter((result) => result.error);
            if (storageErrors.length > 0) {
                setSupabaseDeleteError('Error al eliminar las imágenes del almacenamiento.');
                return;
            }

            // 3: Eliminamos las imagenes de la tabla Imagen_cancha
            const { error: deleteImagesError } = await supabase
                .from('Imagen_cancha')
                .delete()
                .eq('Cancha_id', id);

            if (deleteImagesError) {
                setSupabaseDeleteError('Error al eliminar las imágenes de la cancha.');
                return;
            }

            // 4: Eliminamos la cancha de la tabla Cancha
            const { error: deleteCanchaError } = await supabase
                .from('Cancha')
                .delete()
                .match({ id });

            if (deleteCanchaError) {
                setSupabaseDeleteError('Error al eliminar la cancha.');
            } else {
                fetchCanchas();
            }
        } catch (error) {
            setSupabaseDeleteError('Se produjo un error inesperado.');
        }
    };

    // Función para redirigir a la página de edición de la cancha
    const handleEdit = (id) => {
        window.location.href = `/admin/editarCancha/${id}`;
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
                    Editar Canchas
                </h1>
                <div className="mt-10 px-6">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-sm uppercase ${theme === 'dark' ? 'text-gray-400 bg-gray-700' : 'text-gray-700 bg-[#F4F4F4]'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Tipo de Superficie
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Tamaño
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Precio de la hora
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Características
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Disciplina
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Imágenes
                                </th>
                                <th scope="col" className="px-6 py-3 font-semibold">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {canchas.map((cancha) => (
                                <tr key={cancha.id} className={`border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    <td className="px-6 py-4 font-medium">{cancha.Nombre}</td>
                                    <td className="px-6 py-4">{cancha.Superficie}</td>
                                    <td className="px-6 py-4">{cancha.Tamanio}</td>
                                    <td className="px-6 py-4">{cancha.Precio_hora}</td>
                                        <td className="px-6 py-4">
                                        <div className='flex flex-col items-center justify-center'>
                                        <Button
                                            onClick={() => handleEdit(cancha.id)}
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
                                        </div>
                                        </td>
                                    <td className="px-6 py-4">{cancha.Disciplina.Nombre}</td>
                                    <td className="px-6 py-4">
                                        {cancha.Imagen_cancha.length > 0 && (
                                            cancha.Imagen_cancha.map((imagen, index) => (
                                                <Image
                                                    key={index}
                                                    src={imagen.Url_img}
                                                    alt={`Imagen de la Cancha ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="object-cover rounded-md m-1"
                                                />
                                            ))
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-row items-center justify-center">
                                        <Button
                                            onClick={() => handleEdit(cancha.id)}
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
                                                    d="M15.232 6.1l-1.232 1.232 4.768 4.768 1.232-1.232a2.5 2.5 0 0 0 0-3.536L18.768 6.1a2.5 2.5 0 0 0-3.536 0zm-4.768 6.536L9.232 16.1 4.768 11.636 8.768 7.636l2.5 2.5L8.768 11.636 9.232 16.1z"
                                                    />
                                            </svg>
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(cancha.id)}
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
                                        </div>
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
                        Ingresar Nueva Cancha
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
                            value={newCancha.Nombre}
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
                        <Label htmlFor="Superficie">Tipo de Superficie</Label>
                        <Input
                            type="text"
                            name="Superficie"
                            value={newCancha.Superficie}
                            onChange={handleInputChange}
                            className={`${errors.Superficie ? 'border border-red-600' : ''}`}
                        />
                        {errors.Superficie && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Superficie}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Tamanio">Tamaño</Label>
                        <Input
                            type="text"
                            name="Tamanio"
                            value={newCancha.Tamanio}
                            onChange={handleInputChange}
                            className={`${errors.Tamanio ? 'border border-red-600' : ''}`}
                        />
                        {errors.Tamanio && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Tamanio}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Precio_hora">Valor hora</Label>
                        <Input
                            name="Precio_hora"
                            value={newCancha.Precio_hora}
                            onChange={handleInputChange}
                            className={`${errors.Precio_hora ? 'border border-red-600' : ''}`}
                        />
                        {errors.Precio_hora && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Precio_hora}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Caracteristicas">Caracteristicas</Label>
                        <Input
                        type="text"
                        name="Caracteristicas"
                        value={newCancha.Caracteristicas}
                        onChange={handleInputChange}
                        className={`${errors.Caracteristicas ? 'border border-red-600' : ''}`}
                        />
                        {errors.Caracteristicas && (
                        <span className="text-xs text-red-600 mt-1 ml-2">
                            {errors.Caracteristicas}
                        </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="Disciplina_id">Disciplina</Label>
                        <Select
                        name='Disciplina_id'
                        value={newCancha.Disciplina_id}
                        onValueChange={handleSelectChange}
                        >
                            <SelectTrigger
                                className={`${
                                    errors.Disciplina_id ? 'border border-red-600' : 'w-full'
                                }`}
                                >
                                <SelectValue placeholder='Seleccione una Disciplina'>
                                    {newCancha.Disciplina_id ? canchas.find(cancha => cancha.id === newCancha.Cancha_id)?.Nombre : 'Seleccione una Disciplina'}
                                </SelectValue> 
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Fútbol</SelectItem>
                                <SelectItem value="2">Tennis</SelectItem>
                                <SelectItem value="3">Paddle</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.Disciplina_id && (
                            <span className="text-xs text-red-600 mt-1 ml-2">
                                {errors.Disciplina_id}
                            </span>
                        )}
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="file_inp">Imágenes</Label>
                        <Input
                            id="file_inp"
                            name="file_inp"
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className={`${errors.Imagen ? 'border border-red-600' : ''}`}
                        />
                        {errors.Imagen && (
                            <span className="text-xs text-red-600 ml-2">{errors.Imagen}</span>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button className="my-5 w-[180px]" onClick={handleSubmit}>
                        Agregar Cancha
                    </Button>
                </form>

                {supabaseErrors.canchaExiste && (
                    <span className="text-xs text-red-600 -mt-10 ml-10">
                        {supabaseErrors.canchaExiste}
                    </span>
                )}
                {supabaseErrors.insertError && (
                    <span className="text-xs text-red-600 -mt-10 ml-10">
                        {supabaseErrors.insertError}
                    </span>
                )}
                {supabaseErrors.uploadError && (
                    <span className="text-xs text-red-600 -mt-10 ml-10">
                        {supabaseErrors.uploadError}
                    </span>
                )}
                {supabaseErrors.publicUrlError && (
                    <span className="text-xs text-red-600 -mt-10 ml-10">
                        {supabaseErrors.publicUrlError}
                    </span>
                )}
                {supabaseErrors.imageError && (
                    <span className="text-xs text-red-600 -mt-10 ml-10">
                        {supabaseErrors.imageError}
                    </span>
                )}

                <Toaster />
            </main>
        </>
    );
}
