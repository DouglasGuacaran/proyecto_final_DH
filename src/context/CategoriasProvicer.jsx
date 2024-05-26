'use client';
import { createClient } from '@/utils/supabase/client';
import React, { createContext, useState, useContext, useEffect } from 'react';

const CategoriasContext = createContext();

export const useCategorias = () => {
    return useContext(CategoriasContext);
    };

    export const CategoriasProvider = ({ children }) => {
    const [categorias, setCategorias] = useState([]);

    async function fetchCategorias() {
        const supabase = createClient();
        const { data: categorias, error } = await supabase
        .from('Disciplina')
        .select('id, Nombre');

        if (error) {
        console.error('Error al obtener las categorías:', error);
        return;
        }

        setCategorias(categorias);
    }

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <CategoriasContext.Provider value={{ categorias, fetchCategorias }}>
        {children}
        </CategoriasContext.Provider>
    );
};
