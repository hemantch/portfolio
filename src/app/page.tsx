import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-[#0A0A0F]">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Certifications />
      <Contact />
    </main>
  );
}
