import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, isBefore } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ModalReservas = ({ isOpen, onClose, onReserve, canchaName, existingReservations, closeModal }) => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);



  const isPastDate = (date) => {
    const today = new Date();
    return isBefore(date, today.setHours(0, 0, 0, 0));
  };

  const handleReserve = () => {
    if (date && timeSlot) {
      const [startTime, endTime] = timeSlot.split(' - ');
      const startDateTime = new Date(date);
      const endDateTime = new Date(date);

      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');

      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);

      const formattedStartDateTime = format(startDateTime, 'yyyy-MM-dd HH:mm:ss');
      const formattedEndDateTime = format(endDateTime, 'yyyy-MM-dd HH:mm:ss');

      onReserve({ startDateTime: formattedStartDateTime, endDateTime: formattedEndDateTime });

      closeModal();
    } else {
      alert('Por favor, selecciona una fecha y un horario.');
    }
  };

  const generateTimeSlots = (start, end) => {
    const times = [];
    const startHour = parseInt(start.split(':')[0], 10);
    const endHour = parseInt(end.split(':')[0], 10);

    for (let hour = startHour; hour < endHour; hour++) {
      const formattedStartHour = hour.toString().padStart(2, '0') + ':00';
      const formattedEndHour = (hour + 1).toString().padStart(2, '0') + ':00';
      times.push(`${formattedStartHour} - ${formattedEndHour}`);
    }

    return times;
  };

  useEffect(() => {
    if (date) {
      const timeSlots = generateTimeSlots('08:00', '23:00');
      const filteredSlots = timeSlots.map((slot) => {
        const isReserved = existingReservations.some((reservation) => {
          const reservationDate = new Date(reservation.Fecha_hora_inicio).toLocaleDateString();
          const reservationStartTime = new Date(reservation.Fecha_hora_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            reservationDate === new Date(date).toLocaleDateString() &&
            reservationStartTime === slot.split(' - ')[0]
          );
        });

        return {
          slot,
          reserved: isReserved,
        };
      });

      setAvailableTimeSlots(filteredSlots);
    }
  }, [date, existingReservations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white hover:bg-red-800 rounded-full w-8 h-8 flex items-center justify-center"
          >
            X
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Reserva en {canchaName}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mb-4",
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

        <Select onValueChange={setTimeSlot}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Horario" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.map(({ slot, reserved }) => (
              <SelectItem key={slot} value={slot} disabled={reserved}>
                {slot} {reserved ? '(Reservado)' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="w-full" onClick={handleReserve}>Reservar</Button>
      </div>
    </div>
  );
};

export default ModalReservas;
