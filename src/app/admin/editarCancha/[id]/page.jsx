'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Image from "next/image";

// Inicializar cliente de Supabase
const supabase = createClient();

export default function EditarCancha() {
    const [id, setId] = useState(null);
    const [cancha, setCancha] = useState(null);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({
        Nombre: '',
        Superficie: '',
        Tamanio: '',
        Precio_hora: '',
        Caracteristicas: '',
        Disciplina_id: '',
        Imagen: '',
    });
    const { toast } = useToast();

    useEffect(() => {
        const pathArray = window.location.pathname.split('/');
        const canchaId = pathArray[pathArray.length - 1];
        setId(canchaId);
    }, []);

    const fetchCancha = useCallback(async (canchaId) => {
        const { data, error } = await supabase
            .from('Cancha')
            .select('*')
            .eq('id', canchaId)
            .single();

        if (error) {
            console.error('Error fetching cancha:', error);
        } else {
            // Asegúrate de que Imagen_cancha siempre sea un array
            console.log(data); 
            if (!data.Imagen_cancha) {
                data.Imagen_cancha = [];
            }
            console.log(data);
            setCancha(data);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchCancha(id);
        }
    }, [id, fetchCancha]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        } else {
            setFile(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCancha((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (value) => {
        setCancha((prevState) => ({
            ...prevState,
            Disciplina_id: value,
        }));
    };

    const handleUpdate = async (e) => {
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

        if (cancha.Nombre === '') newErrors.Nombre = 'Por favor, ingrese el nombre.';
        if (cancha.Superficie === '') newErrors.Superficie = 'Por favor, ingrese la superficie.';
        if (cancha.Tamanio === '') newErrors.Tamanio = 'Por favor, ingrese el tamaño.';
        if (cancha.Precio_hora === '') newErrors.Precio_hora = 'Por favor, ingrese el precio por hora.';
        if (cancha.Disciplina_id === '') newErrors.Disciplina_id = 'Por favor, seleccione una disciplina.';

        if (Object.keys(newErrors).some(key => newErrors[key])) {
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

        const { error } = await supabase
            .from('Cancha')
            .update(cancha)
            .eq('id', id);

        if (error) {
            console.error('Error updating cancha:', error);
        } else {
            if (file) {
                // Subir nueva imagen
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('imagenes_canchas')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Error uploading file:', uploadError);
                } else {
                    // Obtener URL pública de la imagen
                    const {
                        data: { publicUrl },
                        error: publicUrlError,
                    } = supabase.storage.from('imagenes_canchas').getPublicUrl(fileName);

                    if (publicUrlError) {
                        console.error('Error getting public URL:', publicUrlError);
                    } else {
                        // Insertar nueva imagen en la tabla Imagen_cancha
                        const { error: imageError } = await supabase
                            .from('Imagen_cancha')
                            .insert([{ Cancha_id: id, Url_img: publicUrl }]);

                        if (imageError) {
                            console.error('Error inserting image data:', imageError);
                        } else {
                            toast({
                                title: 'Cancha Actualizada',
                                description: `La cancha ${cancha.Nombre} fue actualizada correctamente!`,
                            });
                            setFile(null);
                            fetchCancha(id);
                        }
                    }
                }
            } else {
                toast({
                    title: 'Cancha Actualizada',
                    description: `La cancha ${cancha.Nombre} fue actualizada correctamente!`,
                });
                fetchCancha(id);
            }
        }
    };

    return (
        <>
            {cancha && (
                <main className={`min-h-screen p-4 flex-col bg-white text-black`}>
                    <h1 className="text-2xl font-semibold ml-6 antialiased">
                        Editar Cancha
                    </h1>
                    <div className="mt-10 px-6">
                    <Button onClick={() => window.history.back()}>Volver a la edición</Button>
                        
                        <form
                            onSubmit={handleUpdate}
                            className="max-w-xl ml-10 flex flex-col gap-5"
                        >
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Nombre">Nombre</Label>
                                <Input
                                    type="text"
                                    name="Nombre"
                                    value={cancha.Nombre}
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
                                    value={cancha.Superficie}
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
                                    value={cancha.Tamanio}
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
                                    value={cancha.Precio_hora}
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
                                <Select>
                                    <SelectTrigger
                                        className={`${
                                            errors.Caracteristicas ? 'border border-red-600' : 'w-[280px] md:w-[600px] lg:w-[580px]'
                                        }`}
                                    >
                                        <SelectValue placeholder="Características" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="1" value="1">Opcion 1</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.Caracteristicas && (
                                    <span className="text-xs text-red-600 mt-1 ml-2">
                                        {errors.Caracteristicas}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Disciplina_id">Disciplina</Label>
                                <Select>
                                    <SelectTrigger
                                        className={`${
                                            errors.Disciplina_id ? 'border border-red-600' : 'w-[580px] md:w-[600px] lg:w-[580px]'
                                        }`}
                                    >
                                        <SelectValue placeholder="Seleccione una disciplina" />
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
                                <Label htmlFor="file_inp">Imagen</Label>
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
                            </div>
                            <Button className="my-5 w-[180px]" type="submit">
                                Actualizar Cancha
                            </Button>
                        </form>
                    </div>
                    {Array.isArray(cancha.Imagen_cancha) && cancha.Imagen_cancha.length > 0 && (
                        <div className="mt-10 px-6">
                            <h2 className="text-xl font-semibold ml-6 antialiased">
                                Imágenes de la Cancha
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                                {cancha.Imagen_cancha.map((imagen, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={imagen}
                                            alt={`Imagen de la Cancha ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Toaster />
                </main>
            )}
        </>
    );
}
    