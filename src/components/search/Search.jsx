'use client';
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
import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { isBefore } from 'date-fns';

const supabase = createClient();

export default function Search({ onSearch }) {
  const [date, setDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [canchaName, setCanchaName] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const router = useRouter();

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (canchaName && date && selectedTime) {
      const selectedCancha = suggestions.find(s => s.Nombre === canchaName);
      if (selectedCancha) {
        router.push(`/detail/${selectedCancha.id}`);
      } else {
        console.error('Cancha no encontrada');
      }
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
    className: 'w-[280px] md:w-[200px] lg:w-[280px] p-2 border border-gray-300 rounded-md focus:outline-none bg-white dark:bg-gray-800'
  };

  const theme = {
    container: 'relative',
    suggestionsContainer: 'absolute z-10 bg-white border-white-50 dark:bg-gray-800 border rounded-md mt-1 w-[280px] md:w-[200px] lg:w-[280px]',
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
          theme={theme}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px]  md:w-[200px] lg:w-[280px] justify-start text-left font-normal",
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

      <Select
        options={timeSlots.map(time => ({ value: time, label: time }))}
        className="w-[280px] md:w-[200px] lg:w-[280px]"
        placeholder="Horario"
        isClearable
        onChange={setSelectedTime}
      />

      <Button type="submit">Buscar</Button>
    </form>
  );
}
