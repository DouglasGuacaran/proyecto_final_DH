'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const openMenu = () => setIsOpen(!isOpen)
  return (
    <nav className="fixed top-0 w-full bg-white border-gray-200 z-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image src={'/logo-sinfondo.png'} width={50} height={50} priority alt="Logo de entretiempo"/>
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            EntreTiempo
          </span>
        </Link>
        <Button
          data-collapse-toggle="navbar-default"
          variant='ghost'
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
          onClick={openMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5 text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </Button>
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
              >
                Crear Cuenta
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 "
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

