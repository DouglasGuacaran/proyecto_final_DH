import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from 'next/image'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'


const page = () => {
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
                        <form className="space-y-4">
                            {/* <div className="space-y-2">
                                <Label htmlFor="fullName">Nombre</Label>
                                <Input id="nombreCompleto" placeholder="Ingrese su nombre completo" />
                            </div> */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" placeholder="Ingrese su correo electronico" type="email" />
                            </div>
                            {/* <div className="space-y-2">
                                <Label htmlFor="telefono">Telefono</Label>
                                <Input id="telefono" placeholder="Ingrese su numero celular" type="phone" />
                            </div> */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" placeholder="Ingrese su contraseña" type="password" />
                            </div>
                            <Button className="w-full" type="submit">
                                Iniciar sesion
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No tiene una cuenta?{" "}
                            <Link className="font-medium underline" href="../register">
                                Registrese
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page