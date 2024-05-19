import { Inter } from 'next/font/google';
import './globals.css';
import { CanchasProvider } from '@/context/CanchasProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EntreTiempo',
  description: 'Aplicación para la reserva de canchas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CanchasProvider>{children}</CanchasProvider>
      </body>
    </html>
  );
}
