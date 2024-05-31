// components/EditCanchaModal.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Image from "next/image";
import { useTheme } from '../../context/ThemeContext'; // Importa el contexto de tema

// Inicializar cliente de Supabase
const supabase = createClient();

const EditCanchaModal = ({ canchaId, onClose }) => {
    const { theme } = useTheme(); // Usa el contexto de tema
    const [cancha, setCancha] = useState(null);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);
    const [file, setFile] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const { toast } = useToast();
    const [errors, setErrors] = useState({
        Nombre: '',
        Superficie: '',
        Tamanio: '',
        Precio_hora: '',
        Caracteristicas: '',
        Disciplina_id: '',
        Imagen: '',
    });

    const fetchCancha = useCallback(async (Cancha_id) => {
        const { data, error } = await supabase
            .from('Cancha')
            .select('*')
            .eq('id', Cancha_id)
            .single();

        if (error) {
            console.error('Error fetching cancha:', error);
        } else {
            const { data: selectedCaracs, error: caracsError } = await supabase
                .from('Cancha_Caracteristicas')
                .select('Caracteristica_id')
                .eq('Cancha_id', Cancha_id);

            if (caracsError) {
                console.error('Error fetching cancha caracteristicas:', caracsError);
            } else {
                setSelectedCaracteristicas(selectedCaracs.map(car => car.Caracteristica_id));
            }
            const { data: images, error: imagesError } = await supabase
                .from('Imagen_cancha')
                .select('Url_img')
                .eq('Cancha_id', Cancha_id);

            if (imagesError) {
                console.error('Error fetching cancha images:', imagesError);
            } else {
                data.Imagen_cancha = images.map(image => image.Url_img);
                setImagenes(data.Imagen_cancha);
            }
            setCancha(data);
        }
    }, []);

    const fetchCaracteristicas = useCallback(async () => {
        const { data, error } = await supabase
            .from('Caracteristicas')
            .select('*');
        if (error) {
            console.error('Error fetching caracteristicas:', error);
        } else {
            setCaracteristicas(data);
        }
    }, []);
    const fetchDisciplinas = useCallback(async () => {
        const { data, error } = await supabase
            .from('Disciplina')
            .select('*');
        if (error) {
            console.error('Error fetching disciplinas:', error);
        } else {
            setDisciplinas(data);
        }
    }, []);

    useEffect(() => {
        if (canchaId) {
            fetchCancha(canchaId);
            fetchCaracteristicas();
            fetchDisciplinas(); // Llamar a la función para obtener las disciplinas
        }
    }, [canchaId, fetchCancha, fetchCaracteristicas, fetchDisciplinas]);

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

    const handleCheckboxChange = (Caracteristica_id) => {
        setSelectedCaracteristicas((prevState) =>
            prevState.includes(Caracteristica_id)
                ? prevState.filter(id => id !== Caracteristica_id)
                : [...prevState, Caracteristica_id]
        );
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;
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
        if (selectedCaracteristicas.length === 0) newErrors.Caracteristicas = 'Por favor, seleccione al menos una característica.';
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
            .update({
                Nombre: cancha.Nombre,
                Superficie: cancha.Superficie,
                Tamanio: cancha.Tamanio,
                Precio_hora: cancha.Precio_hora,
                Disciplina_id: cancha.Disciplina_id,
            })
            .eq('id', canchaId);

        if (error) {
            console.error('Error updating cancha:', error);
        } else {
            // Update cancha caracteristicas
            await supabase
                .from('Cancha_Caracteristicas')
                .delete()
                .eq('Cancha_id', canchaId);

            const newCaracteristicas = selectedCaracteristicas.map(Caracteristica_id => ({
                Cancha_id: canchaId,
                Caracteristica_id: Caracteristica_id
            }));

            const { error: insertError } = await supabase
                .from('Cancha_Caracteristicas')
                .insert(newCaracteristicas);

            if (insertError) {
                console.error('Error updating cancha caracteristicas:', insertError);
            } else {
                if (file) {
                    // Subir nueva imagen
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}.${fileExt}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('Imagen_cancha')
                        .upload(fileName, file);

                    if (uploadError) {
                        console.error('Error uploading file:', uploadError);
                    } else {
                        // Obtener URL pública de la imagen
                        const {
                            data: { publicUrl },
                            error: publicUrlError,
                        } = supabase.storage.from('Imagen_cancha').getPublicUrl(fileName);

                        if (publicUrlError) {
                            console.error('Error getting public URL:', publicUrlError);
                        } else {
                            // Insertar nueva imagen en la tabla Imagen_cancha
                            const { error: imageError } = await supabase
                                .from('Imagen_cancha')
                                .insert([{ Cancha_id: canchaId, Url_img: publicUrl }]);

                            if (imageError) {
                                console.error('Error inserting image data:', imageError);
                            } else {
                                toast({
                                    title: "Éxito",
                                    description: "Cancha actualizada exitosamente.",
                                    status: "success",
                                    duration: 5000,
                                    isClosable: true,
                                });
                                onClose();
                            }
                        }
                    }
                } else {
                    toast({
                        title: "Éxito",
                        description: "Cancha actualizada exitosamente.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose();
                }
            }
        }
    };

    const handleDeleteImage = async (image) => {
        const fileName = image.split('/').pop();

        const { error: deleteError } = await supabase.storage
            .from('Imagen_cancha')
            .remove([fileName]);

        if (deleteError) {
            console.error('Error deleting image:', deleteError);
        } else {
            setImagenes(prevState => prevState.filter(img => img !== image));
            toast({
                title: "Éxito",
                description: "Imagen eliminada exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (!cancha) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
                <h2 className='text-center'>Actualizar cancha</h2>
                <div className="flex justify-end">
                    <form onSubmit={handleUpdate} className="p-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="w-full">
                                <Label>Nombre</Label>
                                <Input name="Nombre" value={cancha.Nombre} onChange={handleInputChange} />
                                {errors.Nombre && <p className="text-red-500">{errors.Nombre}</p>}
                            </div>
                            <div className="w-full">
                                <Label>Superficie</Label>
                                <Input name="Superficie" value={cancha.Superficie} onChange={handleInputChange} />
                                {errors.Superficie && <p className="text-red-500">{errors.Superficie}</p>}
                            </div>
                            <div className="w-full">
                                <Label>Tamaño</Label>
                                <Input name="Tamanio" value={cancha.Tamanio} onChange={handleInputChange} />
                                {errors.Tamanio && <p className="text-red-500">{errors.Tamanio}</p>}
                            </div>
                            <div className="w-full">
                                <Label>Precio por Hora</Label>
                                <Input name="Precio_hora" value={cancha.Precio_hora} onChange={handleInputChange} />
                                {errors.Precio_hora && <p className="text-red-500">{errors.Precio_hora}</p>}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Disciplina_id">Disciplina</Label>
                                <Select
                                    name='Disciplina_id'
                                    value={cancha.Disciplina_id}
                                    onValueChange={(value) => handleSelectChange({ target: { name: 'Disciplina_id', value } })}
                                >
                                    <SelectTrigger
                                        className={`${errors.Disciplina_id ? 'border border-red-600' : 'w-full'}`}
                                    >
                                        <SelectValue placeholder='Seleccione una Disciplina'>
                                            {cancha.Disciplina_id ? disciplinas.find(disciplina => disciplina.id === cancha.Disciplina_id)?.Nombre : 'Seleccione una Disciplina'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disciplinas.map((disciplina) => (
                                            <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                                                {disciplina.Nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.Disciplina_id && (
                                    <span className="text-xs text-red-600 mt-1 ml-2">
                                        {errors.Disciplina_id}
                                    </span>
                                )}
                            </div>
                            <div className="w-full">
                                <Label>Características</Label>
                                {caracteristicas.map(carac => (
                                    <div key={carac.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`carac-${carac.id}`}
                                            checked={selectedCaracteristicas.includes(carac.id)}
                                            onChange={() => handleCheckboxChange(carac.id)}
                                        />
                                        <label htmlFor={`carac-${carac.id}`} className="ml-2">{carac.Nombre}</label>
                                    </div>
                                ))}
                                {errors.Caracteristicas && <p className="text-red-500">{errors.Caracteristicas}</p>}
                            </div>
                            <div className="w-full">
                                <Label>Imagen</Label>
                                <input type="file" onChange={handleFileChange} />
                                {errors.Imagen && <p className="text-red-500">{errors.Imagen}</p>}
                                {file && <p>Archivo seleccionado: {file.name}</p>}
                            </div>
                            <div className="w-full mt-4">
                                {imagenes.map((imagen, index) => (
                                    <div key={index} className="relative inline-block mr-2">
                                        <Image src={imagen} alt={`Imagen ${index + 1}`} width={100} height={100} className="rounded-md" />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                            onClick={() => handleDeleteImage(imagen)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full mt-6 flex justify-end">
                                <Button type="submit" className='mr-4'>Actualizar Cancha</Button>
                                <Button type="button" onClick={onClose} className="bg-gray-500 text-white">Cancelar</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default EditCanchaModal;
