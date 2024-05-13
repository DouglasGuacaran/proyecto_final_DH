import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import Gallery from "@/components/gallery/Gallery";


export default function Home() {

  return (
    <>
    <main>
      <Navbar />
      <Hero />
      <Gallery />
    </main>
    </>
  );
}
