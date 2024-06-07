'use client';

import { createClient } from '@/utils/supabase/client';
import React, { createContext, useState, useContext, useEffect } from 'react';

const UsuariosContext = createContext();

export const useUsuarios = () => {
    return useContext(UsuariosContext);
    };

    export const UsuariosProvider = ({ children }) => {
    const [usuarios, setUsuarios] = useState([]);

    async function fetchUsuarios() {
        const supabase = createClient();
        const { data: usuarios, error } = await supabase
        .from('Usuario')
        .select('id, Nombre, Username, Correo, DocumentoDeIdentificacion, Direccion, Telefono, Rol');
        if (error) {
            console.error('Error al obtener los usuarios:', error);
            return;
        }
        setUsuarios(usuarios);
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <UsuariosContext.Provider value={{ usuarios, fetchUsuarios }}>
        {children}
        </UsuariosContext.Provider>
    );
};
