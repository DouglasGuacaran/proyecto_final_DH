'use client';

import { useState, useEffect } from 'react';
import Card from '../card/Card';
import { Toggle } from '../ui/toggle';
import { useCanchas } from '@/context/CanchasProvider';

const Gallery = () => {
  const { canchas } = useCanchas();
  const [selectedSports, setSelectedSports] = useState([]);

  const sports = {
    futbol: 'Fútbol',
    tenis: 'Tenis',
    paddel: 'Paddel',
  };

  const handleToggle = (sport) => {
    setSelectedSports((prevSelected) => {
      if (prevSelected.includes(sport)) {
        return prevSelected.filter((s) => s !== sport);
      } else {
        return [...prevSelected, sport];
      }
    });
  };

  const filteredCanchas =
    selectedSports.length === 0
      ? canchas
      : canchas.filter((cancha) =>
          selectedSports.includes(cancha.Disciplina?.Nombre)
        );

  return (
    <section className="flex flex-col my-10">
      <div className="flex flex-col gap-3 justify-center items-center mb-10">
        <h2 className="font-medium text-lg">Categoría</h2>
        <div className="flex gap-3">
          <Toggle
            pressed={selectedSports.includes(sports.futbol)}
            onPressedChange={() => handleToggle(sports.futbol)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-ball-football w-7 h-7"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#000000"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55z" />
              <path d="M12 7v-4m3 13l2.5 3m-.74 -8.55l3.74 -1.45m-11.44 7.05l-2.56 2.95m.74 -8.55l-3.74 -1.45" />
            </svg>
          </Toggle>
          <Toggle
            pressed={selectedSports.includes(sports.tenis)}
            onPressedChange={() => handleToggle(sports.tenis)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-ball-tennis w-7 h-7"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#000000"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M6 5.3a9 9 0 0 1 0 13.4" />
              <path d="M18 5.3a9 9 0 0 0 0 13.4" />
            </svg>
          </Toggle>
          <Toggle
            pressed={selectedSports.includes(sports.paddel)}
            onPressedChange={() => handleToggle(sports.paddel)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-paddle w-7 h-7"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#000000"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12.718 20.713a7.64 7.64 0 0 1 -7.48 -12.755l.72 -.72a7.643 7.643 0 0 1 9.105 -1.283l2.387 -2.345a2.08 2.08 0 0 1 3.057 2.815l-.116 .126l-2.346 2.387a7.644 7.644 0 0 1 -1.052 8.864" />
              <path d="M14 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M9.3 5.3l9.4 9.4" />
            </svg>
          </Toggle>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-10 px-10">
        {filteredCanchas.map((cancha) => (
          <Card key={cancha.id} dataCancha={cancha} />
        ))}
      </div>
    </section>
  );
};

export default Gallery;
