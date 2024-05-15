  'use client';
  import React, { useState, useEffect } from 'react';
  import { createClient } from '@supabase/supabase-js';
  import Footer from "@/components/footer/Footer";
  import Navbar from "@/components/navbar/Navbar";
  import { Button } from "@/components/ui/Button"; // Asumiendo que tienes un componente Button

  // Inicializar cliente de Supabase
  const supabaseUrl = 'https://sazbeqvdotgnznhvwglg.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhemJlcXZkb3RnbnpuaHZ3Z2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NDYyNzYsImV4cCI6MjAzMTEyMjI3Nn0.fXqkFe1zssvfW77AvbwKzChXWEW5demodEPnq6vP_j8';
  const supabase = createClient(supabaseUrl, supabaseKey);

  export default function Page() {
    const [canchas, setCanchas] = useState([]);
    const [newCancha, setNewCancha] = useState({ nombre: '', descripcion: '' });
    const [error, setError] = useState('');

    useEffect(() => {
      fetchCanchas();
    }, []);

    // Cargar las canchas existentes
    const fetchCanchas = async () => {
      const { data, error } = await supabase.from('Cancha').select(`
      Nombre,
      Direccion,
      Precio_hora,
      Superficie,
      Tamanio,
      Disciplina_id,
      Imagen_cancha (
        Url_img
      ),
      Disciplina (
        Nombre
      )
    `);
      if (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar las canchas');
      } else {
        console.log(data);
        setCanchas(data);
      }
      
    };

    
    
        
    // Manejar el cambio en los inputs del formulario
    const handleInputChange = (e) => {
      setNewCancha({ ...newCancha, [e.target.name]: e.target.value });
    };

    // Función para agregar una nueva cancha
    const handleSubmit = async (e) => {
      e.preventDefault();
      const { data: existingCancha, error } = await supabase
        .from('Cancha')
        .select('Nombre')
        .eq('Nombre', newCancha.Nombre)
        .single();

      if (existingCancha) {
        setError('El nombre de la cancha ya está en uso.');
        return;
      }

      const { data, insertError } = await supabase
        .from('Cancha')
        .insert([newCancha]);

      if (insertError) {
        console.error('Error inserting new cancha:', insertError);
        setError('Error al agregar la cancha.');
      } else {
        fetchCanchas();
        setNewCancha({ Nombre: '', Direccion: '', Superficie: '', Tamanio: '', Precio_hora: '', Disciplina_id: ''});
        setError('');
        setModalOpen(false);
      }
    };

    // Función para eliminar una cancha
    const handleDelete = async (id) => {
      const { data, error } = await supabase
        .from('Cancha')
        .delete()
        .match({ id });

      if (error) {
        console.error('Error deleting cancha:', error);
        setError('Error al eliminar la cancha.');
      } else {
        fetchCanchas();
      }
    };

    return (
      <>
        <Navbar />
        <main className="text-sm sm:text-base md:text-lg lg:text-xl min-h-screen p-4 mt-5">
          <h1 className="text-xl font-bold">Dashboard de Canchas</h1>
          <div className="mt-4">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Dirección</th>
                  <th scope="col" className="px-6 py-3">Tipo de Superficie</th>
                  <th scope="col" className="px-6 py-3">Tamaño</th>
                  <th scope="col" className="px-6 py-3">Precio de la hora</th>
                  <th scope="col" className="px-6 py-3">Disciplina</th>
                  <th scope="col" className="px-6 py-3">Imagen</th>

                </tr>
              </thead>
              <tbody>
                {canchas.map(cancha => (
                  <tr key={cancha.id} className="bg-white border-b">
                    <td className="px-6 py-4">{cancha.Nombre}</td>
                    <td className="px-6 py-4">{cancha.Direccion}</td>
                    <td className="px-6 py-4">{cancha.Superficie}</td>
                    <td className="px-6 py-4">{cancha.Tamanio}</td>
                    <td className="px-6 py-4">{cancha.Precio_hora}</td>
                    <td className="px-6 py-4">{cancha.Disciplina.Nombre}</td>
                    <td className="px-6 py-4">
                  {cancha.Imagen_cancha.length > 0 && (
                    <img src={cancha.Imagen_cancha[0].Url_img} alt="Cancha" className="w-20 h-20 object-cover rounded-md" />
                  )}
                </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="m-4">
            <h1>Ingresa una nueva Cancha:</h1>
          </div>
          <form onSubmit={handleSubmit} className="mb-4">
            
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la cancha:</label>
            <input
              type="text"
              name="Nombre"
              value={newCancha.Nombre}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="Direccion" className="block text-sm font-medium text-gray-700">Dirección del complejo deportivo:</label>
            <input
              type="text"
              name="Direccion"
              value={newCancha.Direccion}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="Superficie" className="block text-sm font-medium text-gray-700">Tipo de Superficie:</label>
            <input
              type="text"
              name="Superficie"
              value={newCancha.Superficie}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="Tamanio" className="block text-sm font-medium text-gray-700">Tamaño de la cancha:</label>
            <input
              type="text"
              name="Tamanio"
              value={newCancha.Tamanio}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <label htmlFor="Precio_hora" className="block text-sm font-medium text-gray-700">Valor de la hora:</label>
            <input
              name="Precio_hora"
              value={newCancha.Precio_hora}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            <div className='row'>
            <label htmlFor="Disciplina_id" className="block text-sm font-medium text-gray-700">Disciplina:</label>
            <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" selected>Seleccione una disciplina</option>
              <option value="1">Fútbol</option>
              <option value="2">Tenis</option>
              <option value="3">Paddel</option>
            </select>
            </div>
            <Button type="submit" className="flex justify-center align-items-center mt-4">Agregar Cancha</Button>
          </form>

        </main>
        <Footer />
      </>
    );
  }
