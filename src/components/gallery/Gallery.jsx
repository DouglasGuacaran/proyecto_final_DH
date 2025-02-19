"use client";
import { useState, useEffect } from "react";
import Card from "../card/Card";
import { Toggle } from "../ui/toggle";
import { useCanchas } from "@/context/CanchasProvider";
import { useTheme } from "@/context/ThemeContext";

const Gallery = () => {
  const { theme } = useTheme();
  const { canchas } = useCanchas();
  const [selectedSports, setSelectedSports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffledCanchas, setShuffledCanchas] = useState([]);
  const cardsPerPage = 10;

  const sports = {
    futbol: "Fútbol",
    tenis: "Tenis",
    paddel: "Paddel",
    basket: "Basket",
  };

  useEffect(() => {
    const shuffled = [...canchas].sort(() => 0.5 - Math.random());
    setShuffledCanchas(shuffled);
  }, [canchas]);

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
      ? shuffledCanchas
      : shuffledCanchas.filter((cancha) =>
          selectedSports.includes(cancha.Disciplina?.Nombre)
        );

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCanchas = filteredCanchas.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  const totalPages = Math.ceil(filteredCanchas.length / cardsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section
      className={`flex flex-col my-10 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      <div className="flex flex-col gap-3 justify-center items-center mb-10">
        <h2 className="font-medium text-lg">
          Encuentra tu cancha según la Categoría Deportiva
        </h2>
        <h4 className="text-sm">
          {" "}
          Pulsa el/los ícono(s) de la(s) categoría(s) de tu interés
        </h4>
        <div className="flex gap-3">
          <div className="relative group">
            <Toggle
              pressed={selectedSports.includes(sports.futbol)}
              onPressedChange={() => handleToggle(sports.futbol)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`icon icon-tabler icon-tabler-ball-football w-7 h-7 ${theme === "dark" ? "stroke-white" : "stroke-black"}`}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
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
            <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-lg pointer-events-none transition-opacity duration-300">
              Fútbol
            </div>
          </div>
          <div className="relative group">
            <Toggle
              pressed={selectedSports.includes(sports.tenis)}
              onPressedChange={() => handleToggle(sports.tenis)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`icon icon-tabler icon-tabler-ball-tennis w-7 h-7 ${theme === "dark" ? "stroke-white" : "stroke-black"}`}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
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
            <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-lg pointer-events-none transition-opacity duration-300">
              Tenis
            </div>
          </div>
          <div className="relative group">
            <Toggle
              pressed={selectedSports.includes(sports.paddel)}
              onPressedChange={() => handleToggle(sports.paddel)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`icon icon-tabler icon-tabler-paddle w-7 h-7 ${theme === "dark" ? "stroke-white" : "stroke-black"}`}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
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
            <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-lg pointer-events-none transition-opacity duration-300">
              Paddel
            </div>
          </div>
          <div className="relative group">
            <Toggle
              pressed={selectedSports.includes(sports.basket)}
              onPressedChange={() => handleToggle(sports.basket)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`icon icon-tabler icon-tabler-ball-basketball w-7 h-7 ${theme === "dark" ? "stroke-white" : "stroke-black"}`}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M5.65 5.65l12.7 12.7" />
                <path d="M5.65 18.35l12.7 -12.7" />
                <path d="M12 3a9 9 0 0 0 9 9" />
                <path d="M3 12a9 9 0 0 1 9 9" />
              </svg>
            </Toggle>
            <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2 mt-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-lg pointer-events-none transition-opacity duration-300">
              Basket
            </div>
          </div>
        </div>
      </div>
      {currentCanchas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto px-10">
          {currentCanchas.map((cancha) => (
            <Card key={cancha.id} dataCancha={cancha} />
          ))}
        </div>
      ) : (
        <p className="text-center col-span-2">No se encontraron resultados</p>
      )}
      <div className="flex justify-center mt-10">
        <nav>
          <ul className="flex pl-0 list-none rounded my-2 space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-2 ml-0 leading-tight ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-600"
                      : "bg-white text-black border-gray-300 hover:bg-gray-200 hover:text-gray-700"
                  } rounded-lg`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Gallery;
