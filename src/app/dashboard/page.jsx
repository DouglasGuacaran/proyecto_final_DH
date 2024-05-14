import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function Page() {
  return (
    <>
    <Navbar />
      <main className="text-sm sm:text-base md:text-lg lg:text-xl min-h-screen">
        Estamos en el dashboard
        Boton para agregar una nueva cancha
        Boton para eliminar una cancha
      </main>
      <Footer />
    </>
  );
}
