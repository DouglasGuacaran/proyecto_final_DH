'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useTheme } from '@/context/ThemeContext';
import CanchasTable from '@/components/admin/CanchasTable';  // importa el nuevo componente
import AgregarCanchaModal from '@/components/modal/AgregarCanchaModal';  // importa el nuevo componente

const supabase = createClient();

export default function Cancha() {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [canchas, setCanchas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getCanchas = async () => {
            try {
                let { data: canchas, error } = await supabase
                    .from('Cancha')
                    .select(`
                        *,
                        Disciplina:Disciplina_id (Nombre),
                        Superficie:Superficie_id (Nombre),
                        Imagen_cancha (Url_img)
                    `);

                if (error) throw error;

                setCanchas(canchas);
                setLoading(false);
            } catch (error) {
                alert(error.message);
                setLoading(false);
            }
        };

        getCanchas();
    }, []);

    const handleAddCancha = () => {
        setLoading(true);
        setIsModalOpen(false);
        setCanchas([...canchas]);
        setLoading(false);
    };

    if (loading) return <p>Cargando...</p>;

    if (loading) return <p>Cargando...</p>;

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
            <div className={`hidden md:block text-sm sm:text-base md:text-lg lg:text-xl min-h-screen p-4 mt-32 flex-col ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <div className='flex justify-between'>
                    <h2 className='text-2xl font-bold'>Listado de canchas</h2>
                    <Button onClick={() => setIsModalOpen(true)}>Agregar cancha</Button>
                </div>
                <CanchasTable
                    theme={theme}
                    canchas={canchas}
                />
                <AgregarCanchaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddCancha}
                />
            </div>
        </>
    );
}