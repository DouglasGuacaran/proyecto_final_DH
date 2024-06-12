'use client';
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { isBefore } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

const supabase = createClient();

export default function Search({ onSearch }) {
  const [date, setDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [canchaName, setCanchaName] = useState('');
  const [selectedCanchaId, setSelectedCanchaId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});
  const { push } = useRouter();
  const { theme } = useTheme();

  const fetchCanchas = async (inputValue) => {
    const { data, error } = await supabase
      .from('Cancha')
      .select('id, Nombre')
      .ilike('Nombre', `%${inputValue}%`);
    if (error) {
      console.error(error);
      return [];
    }
    return data;
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const results = await fetchCanchas(value);
    setSuggestions(results);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion.Nombre;

  const renderSuggestion = suggestion => (
    <div className="p-2 hover:bg-gray-200 cursor-pointer">
      {suggestion.Nombre}
    </div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    setCanchaName(suggestion.Nombre);
    setSelectedCanchaId(suggestion.id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validación de los campos
    const validationErrors = {};
    if (!canchaName) validationErrors.canchaName = 'El nombre de la cancha es requerido';
    if (!date) validationErrors.date = 'La fecha es requerida';
    if (!selectedTime) validationErrors.selectedTime = 'El horario es requerido';

    if (Object.keys(validationErrors).length > 0) {
      alert(Object.values(validationErrors).join('\n'));
      return;
    }

    setErrors({});
    
    if (selectedCanchaId) {
      push(`/${selectedCanchaId}`);
    } else {
      console.error('Cancha no encontrada');
    }
  };

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

  const inputProps = {
    placeholder: 'Buscar cancha',
    value: canchaName,
    onChange: (event, { newValue }) => setCanchaName(newValue),
    className: `w-[280px] md:w-[200px] lg:w-[280px] p-2 border ${errors.canchaName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`
  };

  const themeStyles = {
    container: 'relative',
    suggestionsContainer: `absolute z-10 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-md mt-1 w-[280px] md:w-[200px] lg:w-[280px]`,
    suggestionsList: 'list-none p-0 m-0',
    suggestion: 'p-2',
    suggestionHighlighted: 'bg-gray-200'
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-10 mt-20 flex-col md:flex-row'>
      <div className="relative">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          theme={themeStyles}
          onSuggestionSelected={onSuggestionSelected}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] md:w-[200px] lg:w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              errors.date && "border-red-500",
              theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-black'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>Fecha</span>}
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

      <Select
        options={timeSlots.map(time => ({ value: time, label: time }))}
        className={`w-[280px] md:w-[200px] lg:w-[280px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        placeholder="Hora"
        isClearable
        onChange={setSelectedTime}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: theme === 'dark' ? 'gray' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
            borderColor: state.isFocused ? (theme === 'dark' ? 'white' : 'black') : 'gray'
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: theme === 'dark' ? 'white' : 'black'
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: theme === 'dark' ? 'gray' : 'white',
            color: theme === 'dark' ? 'white' : 'black'
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isFocused ? (theme === 'dark' ? 'darkgray' : 'lightgray') : baseStyles.backgroundColor,
            color: theme === 'dark' ? 'white' : 'black'
          })
        }}
      />

      <Button type="submit">Buscar</Button>
    </form>
  );
}
