"use client"
import React, { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { createClient } from '../../utils/supabase/client'; // Ajusta la ruta según la ubicación de tu archivo
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const supabase = createClient();
let nombreCompleto = '';
const Page = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        phone: "",
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

        const { email, password, name, lastName, phone } = formData;

        try {
            // Registro en supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        lastName,
                        phone
                    }
                }
            });

            if (authError) {
                console.error('Error al registrar:', authError);
                alert('Error al registrar: ' + authError.message);
                return;
            }

            console.log('Usuario registrado:', authData);
            const nombreCompleto = name + ' ' + lastName;

            // Registro en tabla "Usuario"
            const { data: insertData, error: insertError } = await supabase
                .from('Usuario')
                .insert([
                    { Nombre: nombreCompleto, Correo: email, Telefono: phone, Contrasenia: password, uid: authData.user.id, Rol: 'Usuario' },
                ]);

            if (insertError) {
                console.error('Error al guardar en la tabla personalizada:', insertError);
                alert('Error al guardar en la tabla personalizada: ' + insertError.message);
                return;
            }

            alert('Registro exitoso!');
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
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" placeholder="Ingrese su nombre nombre" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input id="lastName" placeholder="Ingrese su apellido" value={formData.lastName} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="Ingrese su correo electronico" type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefono</Label>
                                <Input id="phone" placeholder="Ingrese su numero celular" type="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" placeholder="Ingrese su contraseña" type="password" value={formData.password} onChange={handleChange} />
                            </div>
                            <Button className="w-full" type="submit">
                                Registrarse
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Tienes una cuenta?{" "}
                            <Link className="font-medium underline" href="../login">
                                Inicia sesion
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