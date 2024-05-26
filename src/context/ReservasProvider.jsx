'use client';
import { createClient } from '@/utils/supabase/client';
import React, { createContext, useState, useContext, useEffect } from 'react';

const ReservasContext = createContext();

export const useReservas = () => {
    return useContext(ReservasContext);
    };

    export const ReservasProvider = ({ children }) => {
    const [reservas, setReservas] = useState([]);

    async function fetchReservas() {
        const supabase = createClient();
        const { data: reservas, error } = await supabase
        .from('Reserva')
        .select('Usuario_id, Cancha_id, Fecha_hora_inicio, Fecha_hora_fin, Estado');

        if (error) {
        console.error('Error al obtener las reservas:', error);
        return;
        }

        setReservas(reservas);
    }

    useEffect(() => {
        fetchReservas();
    }, []);

    return (
        <ReservasContext.Provider value={{ reservas, fetchReservas }}>
        {children}
        </ReservasContext.Provider>
    );
};
