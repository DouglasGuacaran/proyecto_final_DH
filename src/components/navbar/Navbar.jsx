"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useTheme } from "@/context/ThemeContext";
import { BellIcon, CircleUserIcon, EllipsisVerticalIcon } from "lucide-react";
import { Menu } from "@headlessui/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, supabase } = useAuth();
  const [userName, setUserName] = useState("");
  const [rol, setRol] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("Usuario") // Ajusta el nombre de la tabla según tu esquema de base de datos
          .select("Username, Rol") // O 'name' dependiendo del campo que quieras mostrar
          .eq("uid", user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setRol(data.Rol);
          console.log(data);
          setUserName(data.Username);
        }
      }
    };

    fetchUserName();
  }, [user, supabase]);

  const openMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  function MoonIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    );
  }

  function SunIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full border-gray-200 z-10 bg-background text-foreground`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src={"/logo-sinfondo.png"}
            width={50}
            height={50}
            priority
            alt="Logo de entretiempo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            entretiempo
          </span>
        </Link>
        <Button
          data-collapse-toggle="navbar-default"
          variant="ghost"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
          onClick={openMenu}
        >
          <span className="sr-only">Abrir menú principal</span>
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
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul
            className={`font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-background`}
          >
            {user ? (
              <>
                <li>
                  <Link href="/favoritos">
                    <Button variant="link" className="text-base">
                      Favoritos
                    </Button>
                  </Link>
                </li>
                {userName && (
                  <li className="flex items-center">
                    <span className="text-base">
                      Bienvenido {userName.charAt(0).toUpperCase() + userName.slice(1)}
                    </span>
                  </li>
                )}
                {rol === "Admin" && (
                  <>
                    <li>
                      <Link href="/admin">
                        <Button variant="link" className="text-base">
                          Administración del Sitio
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <BellIcon className="text-gray-500 h-6 w-6 mt-2" />
                    </li>
                  </>
                )}
                <Menu as="div" className="relative">
                  <Menu.Button>
                    <EllipsisVerticalIcon className="text-gray-500 h-6 w-6 mt-2" />
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/account"
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          Mi Cuenta
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={handleLogout}
                        >
                          Cerrar Sesión
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </>
            ) : (
              <>
                <li>
                  <Link href="/register">
                    <Button variant="link" className="text-base">
                      Crear Cuenta
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/login">
                    <Button variant="link" className="text-base">
                      Iniciar Sesión
                    </Button>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Button
                aria-label="Toggle dark mode"
                className="rounded-full p-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
