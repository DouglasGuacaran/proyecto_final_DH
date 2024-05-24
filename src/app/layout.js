import { Inter } from 'next/font/google';
import './globals.css';
import { CanchasProvider } from '@/context/CanchasProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EntreTiempo',
  description: 'Aplicación para la reserva de canchas',
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <AuthProvider>
              <CanchasProvider>
                {children}
              </CanchasProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
  );
}
