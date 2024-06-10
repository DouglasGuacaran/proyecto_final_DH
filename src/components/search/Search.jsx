'use client';
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { createClient } from '../../utils/supabase/client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isBefore, startOfDay, endOfDay } from 'date-fns';

const supabase = createClient();

export default function Search({ onSearch, clearSearchResults }) {
  const [date, setDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('Disciplina')
        .select('*');
      if (error) {
        console.error(error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const generateTimeSlots = (start, end) => {
    const times = [];
    const startHour = parseInt(start.split(':')[0], 10);
    const endHour = parseInt(end.split(':')[0], 10);

    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      times.push(`${formattedHour}:00`);
    }

    return times;
  };

  const timeSlots = generateTimeSlots('08:00', '23:00');

  const isPastDate = (date) => {
    const today = new Date();
    return isBefore(date, today.setHours(0, 0, 0, 0)); // Compara solo las fechas, sin horas
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearSearchResults(); // Clear previous search results

    if (!date) {
      alert("Por favor, selecciona una fecha.");
      return;
    }

    const startDateTime = startOfDay(date).toISOString().split('T')[0] + 'T' + startTime + ':00';
    const endDateTime = endOfDay(date).toISOString().split('T')[0] + 'T' + endTime + ':00';
    console.log(selectedCategory, startDateTime, endDateTime);

    // Get the ID of the selected category
    const selectedCategoryObj = categories.find(category => category.Nombre === selectedCategory);
    if (!selectedCategoryObj) {
      alert("Por favor, selecciona una categoría válida.");
      return;
    }

    const { id: selectedCategoryId } = selectedCategoryObj;

    const { data: reservas, error: errorReservas } = await supabase
      .from('Reserva')
      .select(`
        *,
        Cancha (
          *,
          Disciplina(*),
          Superficie(*),
          Imagen_cancha(*)
        )
      `)
      .eq('Cancha_id.Nombre', selectedCategory)
      .gte('Fecha_hora_inicio', startTime)
      .lte('Fecha_hora_fin', endTime);


    if (errorReservas) {
      console.error(errorReservas);
      onSearch([]);
      return;
    }

    const { data: canchas, error: errorCanchas } = await supabase
      .from('Cancha')
      .select(`
        *,
        Disciplina(*),
        Superficie(*),
        Imagen_cancha(*)
      `)
      .eq('Disciplina_id', selectedCategoryId);

    if (errorCanchas) {
      console.error(errorCanchas);
      onSearch([]);
      return;
    }

    // Filter out the canchas that are reserved
    const reservedCanchasIds = reservas.map(reserva => reserva.Cancha_id);
    const filteredCanchas = canchas.filter(cancha => !reservedCanchasIds.includes(cancha.id));

    onSearch(filteredCanchas);
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 w-full max-w-6xl">
      <h2 className="text-2xl font-bold mb-2">Busca tu cancha</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Encuentra y reserva la cancha perfecta para tu próximo evento deportivo.
      </p>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="w-full">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="sport">
            Deporte o actividad
          </label>
          <Select id="sport" onValueChange={(value) => setSelectedCategory(value)} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un deporte" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.Nombre}>
                  {category.Nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="date">
            Escoge una Fecha
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => isPastDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="start-time">
            Hora de inicio
          </label>
          <Select required id="start-time" onValueChange={(value) => setStartTime(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Hora de inicio" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="end-time">
            Hora final
          </label>
          <Select id="end-time" required onValueChange={(value) => setEndTime(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Hora final" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time} disabled={startTime && time <= startTime}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Button className="w-full" type="submit">
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
}
