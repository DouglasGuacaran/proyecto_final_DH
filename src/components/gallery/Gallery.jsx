'use client';
// import React from 'react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Card from '../card/Card';

const supabaseUrl = 'https://sazbeqvdotgnznhvwglg.supabase.co/rest/v1/Cancha?select=*';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhemJlcXZkb3RnbnpuaHZ3Z2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NDYyNzYsImV4cCI6MjAzMTEyMjI3Nn0.fXqkFe1zssvfW77AvbwKzChXWEW5demodEPnq6vP_j8';
const supabase = createClient(supabaseUrl, supabaseKey);
console.log(supabase);

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
        <div className="container mx-auto flex">
            {canchas.map((cancha) => (
                <Card key={cancha.id} dataCancha={cancha} />
            ))}
        </div>
    );
};

export default Gallery;

// <div className="container mx-auto">
//     <img src={dataCancha.Imagen_cancha[1].Url_img} alt={dataCancha.Nombre} className="card-image" />
//     <div className="card-body">
//         <h5 className="card-title">Nombre: {dataCancha.Nombre}</h5>
//         <p className="card-text">Dirección: {dataCancha.Direccion}</p>
//         <p className="card-price">Valor de la hora: ${dataCancha.Precio_hora}</p>
//     </div>
// </div>