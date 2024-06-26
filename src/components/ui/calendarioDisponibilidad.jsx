'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

function CalendarioDisponibilidad({
    className,
    classNames,
    canchaId,
    showOutsideDays = true,
    reservationsByDay,
    ...props
}) {
    const [selectedDay, setSelectedDay] = useState(null);

    const handleDayClick = (day, { selected }) => {
        if (selected) {
            setSelectedDay(null);
            props.onDaySelect(null); // Llama a la función callback con null si el día se deselecciona
        } else {
            setSelectedDay(day);
            props.onDaySelect(day); // Llama a la función callback con el nuevo día seleccionado
        }
    };

    // console.log(selectedDay);

    const categorizeDays = (reservationsByDay) => {
        const emptyDays = [];
        const partiallyFilledDays = [];
        const fullyFilledDays = [];

        // Recorrer las reservas por día y categorizar los días
        Object.entries(reservationsByDay).forEach(
            ([dateString, reservations]) => {
                const [day, month, year] = dateString.split('/');
                const date = new Date(year, month - 1, day);

                if (
                    (reservations >= 0 && reservations < 10) ||
                    reservations === undefined ||
                    reservations === null
                ) {
                    emptyDays.push(date);
                } else if (reservations >= 10 && reservations < 15) {
                    partiallyFilledDays.push(date);
                } else if (reservations === 15) {
                    fullyFilledDays.push(date);
                }
            }
        );

        return { emptyDays, partiallyFilledDays, fullyFilledDays };
    };

    const { emptyDays, partiallyFilledDays, fullyFilledDays } =
        categorizeDays(reservationsByDay);

    const modifiers = {
        booked: emptyDays,
        almostFull: partiallyFilledDays,
        full: fullyFilledDays,
    };

    const modifiersClassNames = {
        booked: ' bg-green-300',
        almostFull: 'bg-yellow-500',
        full: 'bg-red-500',
    };

    return (
        <DayPicker
            locale={es}
            selected={selectedDay}
            onDayClick={handleDayClick}
            showOutsideDays={showOutsideDays}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell:
                    'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 p-0   font-normal aria-selected:opacity-100'
                ),
                day_range_end: 'day-range-end',
                day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside:
                    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle:
                    'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" />
                ),
            }}
            {...props}
        />
    );
}
CalendarioDisponibilidad.displayName = 'Calendario';

export { CalendarioDisponibilidad };
