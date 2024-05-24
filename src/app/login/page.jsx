"use client"
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { createClient } from '../../utils/supabase/client';


const supabase = createClient();

const Page = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Error al iniciar sesión: ' + error.message);
            } else {
                console.log('Usuario autenticado:', data);
                alert('Inicio de sesión exitoso!');

                //Falta redirigir a pag inicio
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            alert('Error inesperado: ' + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center">
                        <Image src="/logo-sinfondo.png" alt="logo" width={100} height={100} />
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">EntreTiempo</h1>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="Ingrese su correo electrónico" type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" placeholder="Ingrese su contraseña" type="password" value={formData.password} onChange={handleChange} />
                            </div>
                            <Button className="w-full" type="submit">
                                Iniciar sesión
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No tiene una cuenta?{" "}
                            <Link className="font-medium underline" href="../register">
                                Regístrese
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Page;