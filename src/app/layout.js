import { Inter } from "next/font/google";
import "./globals.css";
import { CanchasProvider } from "@/context/CanchasProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { UsuariosProvider } from "@/context/UsuariosProvider";
import { ReservasProvider } from "@/context/ReservasProvider";
import { CategoriasProvider } from "@/context/CategoriasProvicer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "entretiempo",
  description: "Aplicación para la reserva de canchas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <CanchasProvider>
              <UsuariosProvider>
                <ReservasProvider>
                  <CategoriasProvider>{children}</CategoriasProvider>
                </ReservasProvider>
              </UsuariosProvider>
            </CanchasProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
