'use client';
import React, { useState } from 'react';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import { Button } from '@/components/ui/Button'; // Asumiendo que tienes un componente Button
import { useCanchas } from '@/context/CanchasProvider';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';

// Inicializar cliente de Supabase
const supabase = createClient();

export default function page() {
  const [file, setFile] = useState(null);
  const { canchas, fetchCanchas } = useCanchas();
  const [newCancha, setNewCancha] = useState({
    Nombre: '',
    Direccion: '',
    Superficie: '',
    Tamanio: '',
    Precio_hora: '',
    Disciplina_id: '',
  });
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('Agregar imagen');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    } else {
      setFileName('Agrega imagen');
    }
  };

  // Manejar el cambio en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Accede a `name` y `value` de `e.target`
    setNewCancha((prevState) => ({
      ...prevState,
      [name]: value, // Usa el valor de `name` para actualizar la propiedad correspondiente
    }));
  };

  // Función para agregar una nueva cancha
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: existingCancha, error } = await supabase
      .from('Cancha')
      .select('Nombre')
      .eq('Nombre', newCancha.Nombre)
      .single();

    if (existingError || !existingCancha) {
      console.error('Error al verificar el nombre existente:', existingError);
      setError('Error al verificar el nombre existente.');
      return;
    }

    if (existingCancha.length > 0) {
      setError('Una cancha con este nombre ya existe.');
      console.log('Una cancha con este nombre ya existe.');
      return;
    }

    let uploadUrl = null;

    // Subir archivo si existe
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imagenes_canchas')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError('Error al subir la imagen.');
        return;
      }
      uploadUrl = `${
        supabase.storage.from('imagenes_canchas').getPublicUrl(fileName)
          .publicURL
      }`;
    }

    // Intentar insertar nueva cancha
    const { data: newCanchaData, error: insertError } = await supabase
      .from('Cancha')
      .insert([{ ...newCancha, Url_imagen: uploadUrl || '' }]);

    if (insertError || !newCanchaData) {
      console.error('Error inserting data:', insertError);
      setError('Error al insertar la cancha.');
      return;
    }

    console.log('Cancha agregada correctamente:', newCanchaData);

    if (uploadUrl && newCanchaData.length > 0) {
      const { data: imageData, error: imageError } = await supabase
        .from('Imagen_cancha')
        .insert([
          {
            cancha_id: newCanchaData[0].id, // Usar con cuidado
            url_img: uploadUrl,
          },
        ]);

      if (imageError) {
        console.error('Error inserting image data:', imageError);
        setError('Error al insertar datos de imagen.');
      } else {
        console.log('Imagen asociada correctamente a la cancha:', imageData);
      }
    }

    setNewCancha({
      Nombre: '',
      Direccion: '',
      Superficie: '',
      Tamanio: '',
      Precio_hora: '',
      Disciplina_id: '',
    });
    fetchCanchas();
    setError('');
    setFile(null);
    setFileName('Agrega imagen');
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
      <div className="block md:hidden min-h-screen flex items-center justify-center flex-col">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 text-red-600 mb-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <h2 className="text-center">
          El panel de administrador esta disponible únicamente en versión
          desktop
        </h2>
      </div>
      <main className="hidden md:block text-sm sm:text-base md:text-lg lg:text-xl min-h-screen p-4 mt-5">
        <h1 className="text-xl font-bold">Dashboard de Canchas</h1>
        <div className="mt-4">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3">
                  Dirección
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipo de Superficie
                </th>
                <th scope="col" className="px-6 py-3">
                  Tamaño
                </th>
                <th scope="col" className="px-6 py-3">
                  Precio de la hora
                </th>
                <th scope="col" className="px-6 py-3">
                  Disciplina
                </th>
                <th scope="col" className="px-6 py-3">
                  Imagen
                </th>
              </tr>
            </thead>
            <tbody>
              {canchas.map((cancha) => (
                <tr key={cancha.id} className="bg-white border-b">
                  <td className="px-6 py-4">{cancha.Nombre}</td>
                  <td className="px-6 py-4">{cancha.Direccion}</td>
                  <td className="px-6 py-4">{cancha.Superficie}</td>
                  <td className="px-6 py-4">{cancha.Tamanio}</td>
                  <td className="px-6 py-4">{cancha.Precio_hora}</td>
                  <td className="px-6 py-4">{cancha.Disciplina.Nombre}</td>
                  <td className="px-6 py-4">
                    {cancha.Imagen_cancha.length > 0 && (
                      <img
                        src={cancha.Imagen_cancha[0].Url_img}
                        alt="Imagen de la Cancha"
                        className="w-20 h-20 object-cover rounded-md"
                      />
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
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre de la cancha:
          </label>
          <input
            type="text"
            name="Nombre"
            value={newCancha.Nombre}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <label
            htmlFor="Direccion"
            className="block text-sm font-medium text-gray-700"
          >
            Dirección del complejo deportivo:
          </label>
          <input
            type="text"
            name="Direccion"
            value={newCancha.Direccion}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <label
            htmlFor="Superficie"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo de Superficie:
          </label>
          <input
            type="text"
            name="Superficie"
            value={newCancha.Superficie}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <label
            htmlFor="Tamanio"
            className="block text-sm font-medium text-gray-700"
          >
            Tamaño de la cancha:
          </label>
          <input
            type="text"
            name="Tamanio"
            value={newCancha.Tamanio}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <label
            htmlFor="Precio_hora"
            className="block text-sm font-medium text-gray-700"
          >
            Valor de la hora:
          </label>
          <input
            name="Precio_hora"
            value={newCancha.Precio_hora}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <div className="row">
            <label
              htmlFor="Disciplina_id"
              className="block text-sm font-medium text-gray-700"
            >
              Disciplina:
            </label>
            <select
              name="Disciplina_id"
              value={newCancha.Disciplina_id}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" selected>
                Seleccione una disciplina
              </option>
              <option value="1">Fútbol</option>
              <option value="2">Tenis</option>
              <option value="3">Paddel</option>
            </select>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="file_inp"
            >
              Agregar Imagen:
            </label>
            <Input
              id="file_inp"
              name="file_inp"
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="flex justify-center align-items-center mt-4"
          >
            Agregar Cancha
          </Button>
        </form>
      </main>
      <Footer />
    </>
  );
}
