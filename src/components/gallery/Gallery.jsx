'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Card from '../card/Card';

const supabaseUrl = 'https://sazbeqvdotgnznhvwglg.supabase.co/rest/v1/Cancha?select=*';
const supabaseUrl1 = 'https://sazbeqvdotgnznhvwglg.supabase.co/rest/v1/Imagen_cancha?select=*?Id=eq.1';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhemJlcXZkb3RnbnpuaHZ3Z2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NDYyNzYsImV4cCI6MjAzMTEyMjI3Nn0.fXqkFe1zssvfW77AvbwKzChXWEW5demodEPnq6vP_j8';
const supabase = createClient(supabaseUrl, supabaseKey);

const Gallery = () => {
    const [canchas, setCanchas] = useState([]);

    async function fetchImageData() {
        // Consulta para obtener las canchas y su primera imagen asociada
        const { data: canchas, error } = await supabase
            .from('Cancha')  // Asumiendo que tienes una tabla de canchas
            .select(`
                id,
                Nombre,
                Direccion,
                Superficie,
                Tamanio,
                Precio_hora,
                Disciplina_id,
                Imagen_cancha (
                    Url_img
                )
            `)
            .order('id', { foreignTable: 'Imagen_cancha', ascending: true })

        if (error) {
            console.error('Error al obtener las canchas e imágenes:', error);
            return;
        }

        // Mapea y toma la primera imagen para cada cancha
        const dataCanchas = canchas.map(cancha => ({
            ...cancha,
            imagen: cancha.Imagen_cancha[0]?.Url_img || 'default-image-path.jpg'
        }));
        
        setCanchas(dataCanchas);
    }

    useEffect(() => {
        fetchImageData();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-10 my-20 px-10">
            {canchas.map((cancha) => (
                <Card key={cancha.id} dataCancha={cancha} />
            ))}
        </div>
    );
};

export default Gallery;
