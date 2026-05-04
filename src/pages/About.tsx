// src/pages/About.tsx

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import AboutHero from "../components/about/AboutHero";
import MissionVision from "../components/about/MissionVision";
import Leadership from "../components/about/Leadership";
import CallToAction from "../components/about/CallToAction";

export default function About() {
  return (
    <main className="bg-brand-cream text-brand-ink overflow-hidden">
      <Navbar />

      <AboutHero />

      <MissionVision />

      <Leadership />

      <CallToAction />

      <Footer />
    </main>
  );
}
