'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { createClient } from '../../utils/supabase/client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect } from 'react';
import { isBefore } from 'date-fns';

const supabase = createClient();

export default function Search() {
    const [date, setDate] = useState(null)
    const [categories, setCategories] = useState([]);

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

      return times
    };
    const timeSlots = generateTimeSlots('08:00', '23:00');

    const isPastDate = (date) => {
      const today = new Date();
      return isBefore(date, today.setHours(0, 0, 0, 0)); // Compara solo las fechas, sin horas
    };


  return (
    <div className='flex gap-10 mt-20 flex-col md:flex-row'>
      <Select>
        <SelectTrigger className="w-[280px] md:w-[200px] lg:w-[280px]">
          <SelectValue placeholder="Deporte" />
        </SelectTrigger>
        <SelectContent>
            {categories.map(category => (
            <SelectItem key={category.id} value={category.Nombre}>
              {category.Nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

      <Select>
        <SelectTrigger className="w-[280px]  md:w-[200px] lg:w-[280px]">
          <SelectValue placeholder="Horario" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map(time => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}


        </SelectContent>
      </Select>

      <Button>Buscar</Button>
    </div>
  );
}
