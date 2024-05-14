import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white rounded-lg m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image
              src={'/logo-sinfondo.png'}
              width={50}
              height={50}
              priority
              alt="Logo de entretiempo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
              EntreTiempo
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
            <li>
              <Link href="/" className="hover:underline me-4 md:me-6">
                Crear Cuenta
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline me-4 md:me-6">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:underline me-4 md:me-6">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center ">
          © 2024 Equipo 5. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
