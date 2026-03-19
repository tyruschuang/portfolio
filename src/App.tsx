import MagneticCursor from "./components/MagneticCursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <div className="folio-root min-h-screen bg-[#f8f5f0] text-[#1a1816] font-outfit selection:bg-[#b14a32] selection:text-white">
      <MagneticCursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Work />
      <Projects />
      <Contact />
    </div>
  );
}
