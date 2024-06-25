import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

const supabase = createClient();

const AgregarCanchaModal = ({ isOpen, onClose, onAdd }) => {
    const { theme } = useTheme();
    const [nombre, setNombre] = useState('');
    const [tamanio, setTamanio] = useState('');
    const [precioHora, setPrecioHora] = useState('');
    const [disciplinaId, setDisciplinaId] = useState('');
    const [superficieId, setSuperficieId] = useState('');
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [superficies, setSuperficies] = useState([]);
    const [horarios, setHorarios] = useState([]);
    console.log(horarios);

    useEffect(() => {
        const fetchData = async () => {
            let { data: disciplinasData } = await supabase
                .from('Disciplina')
                .select('*');
            let { data: superficiesData } = await supabase
                .from('Superficie')
                .select('*');
            setDisciplinas(disciplinasData);
            setSuperficies(superficiesData);
        };

        fetchData();
    }, []);

    const handleCaracteristicaChange = (event) => {
        const { value, checked } = event.target;
        setCaracteristicas((prev) =>
            checked
                ? [...prev, value]
                : prev.filter((caracteristica) => caracteristica !== value)
        );
    };
    const handleImagenesChange = (event) => {
        setImagenes([...event.target.files]);
    };

    const handleHorarioChange = (event) => {
        const { value, checked } = event.target;
        setHorarios((prev) =>
            checked
                ? [...prev, value]
                : prev.filter((horario) => horario !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Insertar la cancha en la tabla Cancha
            const { data: nuevaCancha, error: errorInsertCancha } =
                await supabase
                    .from('Cancha')
                    .insert([
                        {
                            Nombre: nombre,
                            Tamanio: tamanio,
                            Precio_hora: precioHora,
                            Disciplina_id: disciplinaId,
                            Superficie_id: superficieId,
                            Caracteristicas: caracteristicas,
                            Horarios: horarios,
                        },
                    ])
                    .select()
                    .single();

            if (errorInsertCancha) throw errorInsertCancha;

            const canchaId = nuevaCancha.id;

            // Subir las imágenes al bucket y obtener las URLs
            const imagenesURLs = await Promise.all(
                imagenes.map(async (imagen) => {
                    const { data: uploadData, error: uploadError } =
                        await supabase.storage
                            .from('imagenes_canchas')
                            .upload(`${canchaId}/${imagen.name}`, imagen);

                    if (uploadError) throw uploadError;

                    const url = supabase.storage
                        .from('imagenes_canchas')
                        .getPublicUrl(uploadData.path).data.publicUrl;

                    return url;
                })
            );

            // Guardar las URLs en la tabla Imagen_cancha
            const { error: errorInsertImagenes } = await supabase
                .from('Imagen_cancha')
                .insert(
                    imagenesURLs.map((url) => ({
                        Cancha_id: canchaId,
                        Url_img: url,
                    }))
                );

            if (errorInsertImagenes) throw errorInsertImagenes;

            onAdd();
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    const generateHorarios = () => {
        const horarios = [];
        for (let i = 9; i <= 23; i++) {
            const hour = i < 10 ? `0${i}:00` : `${i}:00`;
            horarios.push(hour);
        }
        return horarios;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center mt-20 overflow-auto">
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 my-10 ${theme === 'dark' ? 'text-white' : 'text-black'} max-h-full overflow-y-auto mt-20`}
            >
                <h2 className="text-2xl mb-4">Agregar Cancha</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-base">Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full px-3 py-1 border rounded dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-base">Tamaño:</label>
                        <input
                            type="text"
                            value={tamanio}
                            onChange={(e) => setTamanio(e.target.value)}
                            required
                            className="w-full px-3 py-1 border rounded dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-base">
                            Precio por hora:
                        </label>
                        <input
                            type="number"
                            value={precioHora}
                            onChange={(e) => setPrecioHora(e.target.value)}
                            required
                            className="w-full px-3 py-1 border rounded dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-base">
                            Disciplina:
                        </label>
                        <select
                            value={disciplinaId}
                            onChange={(e) => setDisciplinaId(e.target.value)}
                            required
                            className="w-full px-3 py-1 border rounded dark:bg-gray-700 text-base"
                        >
                            <option value="">Seleccione una disciplina</option>
                            {disciplinas.map((disciplina) => (
                                <option
                                    key={disciplina.id}
                                    value={disciplina.id}
                                >
                                    {disciplina.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-base">
                            Tipo de superficie:
                        </label>
                        <select
                            value={superficieId}
                            onChange={(e) => setSuperficieId(e.target.value)}
                            required
                            className="w-full px-2 py-1 border rounded dark:bg-gray-700 text-base"
                        >
                            <option value="">
                                Seleccione un tipo de superficie
                            </option>
                            {superficies.map((superficie) => (
                                <option
                                    key={superficie.id}
                                    value={superficie.id}
                                >
                                    {superficie.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <span className="block mb-1 text-base">
                            Características:
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                'Wifi',
                                'Estacionamiento',
                                'Bar/Comida',
                                'Arriendo de equipo',
                                'Zona de niños',
                                'Acceso para discapacitados',
                                'Camarines',
                                'Zona de espectadores',
                            ].map((caracteristica) => (
                                <label key={caracteristica} className="block">
                                    <input
                                        type="checkbox"
                                        value={caracteristica}
                                        checked={caracteristicas.includes(
                                            caracteristica
                                        )}
                                        onChange={handleCaracteristicaChange}
                                        className="mr-2"
                                    />
                                    {caracteristica}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-base">
                            Horarios:
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {generateHorarios().map((horario) => (
                                <label key={horario} className="block">
                                    <input
                                        type="checkbox"
                                        value={horario}
                                        checked={horarios.includes(horario)}
                                        onChange={handleHorarioChange}
                                        className="mr-2"
                                    />
                                    {horario}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-base">
                            Imágenes:
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImagenesChange}
                            className="w-full px-1 py-1 border rounded dark:bg-gray-700"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button type="submit">Agregar</Button>
                        <Button onClick={onClose} variant="secondary">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarCanchaModal;
