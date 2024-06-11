"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`rounded-lg m-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
    >
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
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
          <ul
            className={`flex flex-wrap items-center mb-6 text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} sm:mb-0`}
          >
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                <i className="fab fa-facebook"></i>
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                <i className="fab fa-instagram"></i>
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                <i className="fab fa-twitter"></i>
              </Link>
            </li>
          </ul>
        </div>
        <hr
          className={`my-6 ${theme === "dark" ? "border-gray-700" : "border-gray-200"} sm:mx-auto lg:my-8`}
        />
        <span
          className={`block text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} sm:text-center`}
        >
          © 2024 Equipo 5. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
