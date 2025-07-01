import React from "react";
import HeroSection from "./components/home/Herosection";
import StatsSection from "./components/home/StatsSection";
import ProgramsPreview from "./components/home/ProgramsPreview";
import FacilitiesPreview from "./components/home/FacilitiesPreview";
import TestimonialsSection from "./components/home/TestimonialsSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ProgramsPreview />
      <FacilitiesPreview />
      <TestimonialsSection />
    </div>
  );
}