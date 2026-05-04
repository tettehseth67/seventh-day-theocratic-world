// src/pages/Home.tsx

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import Welcome from "../components/home/Welcome";
import ServiceTimes from "../components/home/ServiceTimes";

export default function Home() {
  return (
    <main className="bg-brand-cream text-brand-ink overflow-hidden">
      <Navbar />

      <Hero />

      <Welcome />

      <ServiceTimes />

      <Footer />
    </main>
  );
}
