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
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from 'react';

export default function Search() {
    const [date, setDate] = useState(null)
  return (
    <div className='flex gap-10 mt-20 flex-col md:flex-row'>
      <Select>
        <SelectTrigger className="w-[280px] md:w-[200px] lg:w-[280px]">
          <SelectValue placeholder="Deporte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Fútbol">Fútbol</SelectItem>
          <SelectItem value="Tennis">Tennis</SelectItem>
          <SelectItem value="Paddle">Paddle</SelectItem>
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
        />
      </PopoverContent>
    </Popover>



      <Select>
        <SelectTrigger className="w-[280px]  md:w-[200px] lg:w-[280px]">
          <SelectValue placeholder="Horario" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="9:00">9:00</SelectItem>
          <SelectItem value="10:00">10:00</SelectItem>
          <SelectItem value="11:00">11:00</SelectItem>
        </SelectContent>
      </Select>

      <Button>Buscar</Button>
    </div>
  );
}
