'use client';

import React, { useState } from 'react';
import Canchas from '@/components/admin/Canchas';
import EditarUsuarios from '@/components/admin/EditarUsuarios';
import EditarCategoriaDeportiva from '@/components/admin/EditarCategoriaDeportiva';
import EditarReservas from '@/components/admin/EditarReservas';
import withAuth from '@/components/hoc/withAuth';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import Tabs from '@/components/ui/tabs';

function AdminPage() {
const tabs = [
    {
        id: 'canchas',
        label: 'Canchas',
        content: <Canchas />,
    },
    {
        id: 'usuarios',
        label: 'Usuarios',
        content: <EditarUsuarios />,
    },
    {
        id: 'categorias',
        label: 'Categorías Deportivas',
        content: <EditarCategoriaDeportiva />,
    },
    {
        id: 'reservas',
        label: 'Reservas',
        content: <EditarReservas />,
    },
    ];

    return (
        <>
        <Navbar />
            <div className="container mx-auto mt-20 pt-20">
            <Tabs tabs={tabs} defaultTab="canchas" />
            </div>
        <Footer />
        </>
        );
    }

    export default withAuth(AdminPage);
