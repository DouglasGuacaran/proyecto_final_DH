'use client'

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import Footer from '@/components/footer/Footer';
import Image from 'next/image';

export default function Page() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    documento: '',
    direccion: '',
    telefono: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('Usuario')
          .select('Nombre, Correo, DocumentoDeIdentificacion, Direccion, Telefono, Rol')
          .eq('uid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData({
            nombre: data.Nombre,
            email: data.Correo,
            documento: data.DocumentoDeIdentificacion,
            direccion: data.Direccion,
            telefono: data.Telefono
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supabase = createClient();

    const { error } = await supabase
      .from('Usuario')
      .update({
        Nombre: userData.nombre,
        Correo: userData.email,
        DocumentoDeIdentificacion: userData.documento,
        Direccion: userData.direccion,
        Telefono: userData.telefono
      })
      .eq('uid', user.id);

    if (error) {
      console.error('Error updating user data:', error);
    } else {
      alert('Datos actualizados correctamente');
    }
  };

  return (
    <>
      <main>
        <Navbar />
        
        <div className="flex flex-col items-center w-screen bg-gray-100 dark:bg-gray-900">
          <div className="w-full flex flex-col items-center justify-center mt-20">
            <div className="w-11/12 max-w-3xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Image alt="User Avatar" src="/user-avatar.png" className="rounded-full" height={40} width={40} />
                  <div>
                    <h1 className="text-lg font-medium">{`${userData.nombre}`}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="w-full">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" type="text" value={userData.nombre} onChange={handleChange} disabled/>
                </div>
                <div className="w-full">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" value={userData.email} readOnly />
                </div>
                <div className="w-full">
                  <Label htmlFor="documento">Documento de identidad</Label>
                  <Input id="documento" name="documento" type="text" value={userData.documento} onChange={handleChange} />
                </div>
                <div className="w-full">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" name="direccion" type="text" value={userData.direccion} onChange={handleChange} />
                </div>
                <div className="w-full">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" name="telefono" type="text" value={userData.telefono} onChange={handleChange} />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" type="reset">Cancelar</Button>
                  <Button type="submit">Guardar cambios</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}


