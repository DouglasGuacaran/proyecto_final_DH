'use client';
import { Toaster } from '@/components/ui/toaster';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCanchas } from '@/context/CanchasProvider';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Image from "next/image";
import { useTheme } from '@/context/ThemeContext';
import Modal from '../modal/Modal';
import EditCanchaModal from '../editCanchaModal/editCanchaModal';

// Inicializar cliente de Supabase
const supabase = createClient();

export default function Page() {
    const { theme } = useTheme();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [canchas2, setCanchas] = useState([]);
    useEffect(() => {
    const cargarCanchas = async () => {
        let { data: Cancha, error } = await supabase
        .from('Cancha')
        .select('*, Superficie_id (Nombre), Disciplina (Nombre) , Imagen_cancha (Url_img)');

        if (error) console.error('Error cargando canchas:', error);
        else setCanchas(Cancha);
    };

    cargarCanchas();
    }, []);

    const { canchas, fetchCanchas } = useCanchas();
    const [newCancha, setNewCancha] = useState({
        Nombre: '',
        // Superficie: '',
        Tamanio: '',
        Precio_hora: '',
        Disciplina_id: '',
        Superficie_id: '',
        Caracteristicas: [],
    });
    const [errors, setErrors] = useState({
        Nombre: '',
        // Superficie: '',
        Tamanio: '',
        Precio_hora: '',
        Disciplina_id: '',
        Imagen: '',
        Superficie_id: '',
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
    const handleDisciplinaChange = (value) => {
        setNewCancha((prevState) => ({
            ...prevState,
            Disciplina_id: value,
        }));
    };

    const handleSuperficieChange = (value) => {
        setNewCancha((prevState) => ({
            ...prevState,
            Superficie_id: value,
        }));
    };



    // Función para agregar una nueva cancha
    // Función para agregar una nueva cancha
    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {
            Nombre: '',
            // Superficie: '',
            Tamanio: '',
            Precio_hora: '',
            Disciplina_id: '',
            Imagen: '',
            Superficie_id: '',
        };

        // validaciones generales
        if (newCancha.Nombre === '') {
            newErrors.Nombre = 'Por favor, ingrese un nombre para la cancha.';
        }
        // if (newCancha.Superficie === '') {
        //     newErrors.Superficie = 'Por favor, ingrese una superficie para la cancha.';
        // }
        if (newCancha.Tamanio === '') {
            newErrors.Tamanio = 'Por favor, ingrese un tamaño para la cancha.';
        }
        if (newCancha.Precio_hora === '') {
            newErrors.Precio_hora = 'Por favor, ingrese un precio para la cancha.';
        }
        if (newCancha.Disciplina_id === '') {
            newErrors.Disciplina_id = 'Por favor, seleccione una disciplina para la cancha.';
        }
        if (newCancha.Superficie_id === '') {
            newErrors.Superficie_id = 'Por favor, seleccione una superficie para la cancha.';
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
            Disciplina_id: '',
            Imagen: '',
            Superficie_id: '',
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
            Tamanio: '',
            Precio_hora: '',
            Disciplina_id: '',
            Superficie_id: '',
        });
        setFiles([]);
        setPreviews([]); // Asegúrate de limpiar las previsualizaciones de imágenes también
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // calcular elementos
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = canchas2.slice(indexOfFirstItem, indexOfLastItem);

    // total pags
    const totalPages = Math.ceil(canchas2.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const [selectedCanchaId, setSelectedCanchaId] = useState(null);

    // cargar disciplinas
    const [disciplinas, setDisciplinas] = useState([]);
    const [superficie, setSuperficie] = useState([]);
    useEffect(() => {
    const cargarDisciplinas = async () => {
        let { data: Disciplina, error } = await supabase
        .from('Disciplina')
        .select('*');

        if (error) console.error('Error cargando disciplinas:', error);
        else setDisciplinas(Disciplina);
    };

    cargarDisciplinas();
    }, []);

    useEffect(() => {
        const cargarSuperficie = async () => {
            let { data: Superficie, error } = await supabase
                .from('Superficie')
                .select('*');

            if (error) console.error('Error cargando superficies:', error);
            else setSuperficie(Superficie);
        };

        cargarSuperficie();
    }, []);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const handleCaracteristicasChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setCaracteristicas(prev => {
                const newCaracteristicas = [...prev, name];
                setNewCancha(prevCancha => ({ ...prevCancha, Caracteristicas: newCaracteristicas }));
                return newCaracteristicas;
            });
        } else {
            setCaracteristicas(prev => {
                const newCaracteristicas = prev.filter(caracteristica => caracteristica !== name);
                setNewCancha(prevCancha => ({ ...prevCancha, Caracteristicas: newCaracteristicas }));
                return newCaracteristicas;
            });
        }
    };
    console.log(caracteristicas);
    // console.log(superficie);
    // console.log(disciplinas);
    console.log(newCancha);

    return (
        <>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {/* Aquí irá el formulario para agregar una cancha */}
                {supabaseDeleteError && (
                    <h2 className="text-xs text-red-600 text-center my-6">
                        {supabaseDeleteError}
                    </h2>
                )}
                <div className="m-4">
                    <h2 className="text-xl font-semibold text-center mt-4 mb-6">
                        Ingresar Nueva Cancha
                    </h2>
                </div>
                <div className='flex justify-center'>
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-lg flex flex-col gap-4"
                    >
                        <div className="flex flex-col">
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

                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <Label htmlFor="wifi">Wifi</Label>
                                <Input
                                    type="checkbox"
                                    name="wifi"
                                    onChange={handleCaracteristicasChange}
                                />
                                <Label htmlFor="estacionamiento">Estacionamiento</Label>
                                <Input
                                    type="checkbox"
                                    name="estacionamiento"
                                    onChange={handleCaracteristicasChange}
                                />
                                {/* Agrega los checkboxes restantes aquí */}
                                <Label htmlFor="comida">Bar/Comida</Label>
                                <Input
                                    type="checkbox"
                                    name="comida"
                                    onChange={handleCaracteristicasChange}
                                />
                                <Label htmlFor="arriendo">Arriendo Equipo</Label>
                                <Input
                                    type="checkbox"
                                    name="arriendo"
                                    onChange={handleCaracteristicasChange}
                                />

                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="zonaNinos">Zona de niños</Label>
                                <Input
                                    type="checkbox"
                                    name="zonaNinos"
                                    onChange={handleCaracteristicasChange}
                                />
                                <Label htmlFor="accesoDiscapacitados">Acceso para discapacitados</Label>
                                <Input
                                    type="checkbox"
                                    name="accesoDiscapacitados"
                                    onChange={handleCaracteristicasChange}
                                />
                                {/* Agrega los checkboxes restantes aquí */}
                                <Label htmlFor="camarines">Camarines</Label>
                                <Input
                                    type="checkbox"
                                    name="camarines"
                                    onChange={handleCaracteristicasChange}
                                />
                                <Label htmlFor="espectadores">Zona espectadores</Label>
                                <Input
                                    type="checkbox"
                                    name="espectadores"
                                    onChange={handleCaracteristicasChange}
                                />

                            </div>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="Disciplina_id">Disciplina</Label>
                            <Select
                                    name='Disciplina_id'
                                    value={canchas2.Disciplina_id}
                                    onValueChange={(value) => handleDisciplinaChange(value)}
                                >
                                    <SelectTrigger
                                        className='w-full'
                                    >
                                        <SelectValue placeholder='Seleccione una Disciplina'>
                                            {canchas2.Disciplina_id ? disciplinas.find(disciplina => disciplina.id === canchas2.Disciplina_id)?.Nombre : 'Seleccione una Disciplina'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disciplinas.map((disciplina) => (
                                            <SelectItem key={disciplina.id} value={disciplina.id}>
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

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="Superficie_id">Superficie</Label>
                            <Select
                                name='Superficie_id'
                                value={superficie.Superficie_id}
                                onValueChange={(value) => handleSuperficieChange(value)}
                            >
                                <SelectTrigger
                                    className={`${errors.Superficie_id ? 'border border-red-600' : 'w-full'
                                        }`}
                                >
                                <SelectValue placeholder='Seleccione una Superficie'>
                                    {superficie.Superficie_id ? superficie.find(superficie => superficie.id === superficie.Superficie_id)?.Nombre : 'Seleccione una Superficie'}
                                </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {superficie.map((superficie) => (
                                        <SelectItem key={superficie.id} value={superficie.id}>
                                        {superficie.Nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.Superficie_id && (
                                <span className="text-xs text-red-600 mt-1 ml-2">
                                    {errors.Superficie_id}
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
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-around'>
                            <Button className="my-5 w-[180px] text-center" onClick={handleSubmit}>
                                Agregar Cancha
                            </Button>
                        </div>


                    </form>
                </div>


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
            </Modal>
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
                <div className='flex justify-between'>
                    <h1 className="text-2xl font-semibold ml-6 antialiased">
                        Editar Canchas
                    </h1>
                    <Button onClick={handleOpenModal}>Agregar canchas</Button>
                </div>

                <div className="mt-10 px-6">
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
                                    <td className="px-6 py-4">{cancha.Superficie_id.Nombre}</td>
                                    <td className="px-6 py-4">{cancha.Tamanio}</td>
                                    <td className="px-6 py-4">{cancha.Precio_hora}</td>
                                    <td className="px-6 py-4">{cancha.Disciplina.Nombre}</td>
                                    <td className="px-6 py-4">
                                        {cancha.Imagen_cancha.length > 0 && (
                                            <Image
                                                src={cancha.Imagen_cancha[0].Url_img}
                                                alt={`Imagen de la Cancha`}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded-md m-1"
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-row items-center justify-center">
                                            <Button
                                                onClick={() => setSelectedCanchaId(cancha.id)}
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

                    {selectedCanchaId && (
                        <EditCanchaModal
                            canchaId={selectedCanchaId}
                            onClose={() => setSelectedCanchaId(null)}
                        />
                    )}

                    {/* paginador */}
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
                </div>
            </main>
        </>
    );
}
