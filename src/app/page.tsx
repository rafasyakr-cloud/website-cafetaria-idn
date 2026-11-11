import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Spaces from "@/components/Spaces";
import About from "@/components/About";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Menu />
        <Spaces />
        <About />
        <Services />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
