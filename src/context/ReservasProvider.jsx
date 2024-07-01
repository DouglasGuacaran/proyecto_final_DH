// context/ReservasProvider.js
'use client';
import { createClient } from '@/utils/supabase/client';
import React, { createContext, useState, useContext, useEffect } from 'react';

const ReservasContext = createContext();

export const useReservas = () => {
    return useContext(ReservasContext);
};

export const ReservasProvider = ({ children }) => {
    const [reservas, setReservas] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

    async function fetchReservas() {
        const supabase = createClient();
        const { data: reservas, error } = await supabase
            .from('Reserva')
            .select('id, Usuario_id, Cancha_id, Fecha_hora_inicio, Fecha_hora_fin, Estado');

        if (error) {
            console.error('Error al obtener las reservas:', error);
            return;
        }

        setReservas(reservas);
    }

    useEffect(() => {
        fetchReservas();
    }, []);

    const addTimeSlot = (slot) => {
        setSelectedTimeSlots((prevSlots) => [...prevSlots, slot]);
    };

    const removeTimeSlot = (slot) => {
        setSelectedTimeSlots((prevSlots) => prevSlots.filter((s) => s !== slot));
    };

    const clearTimeSlots = () => {
        setSelectedTimeSlots([]);
    };

    return (
        <ReservasContext.Provider
            value={{ reservas, fetchReservas, selectedTimeSlots, addTimeSlot, removeTimeSlot, clearTimeSlots }}
        >
            {children}
        </ReservasContext.Provider>
    );
};
