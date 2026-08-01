"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FloatingSearch from "./components/FloatingSearch";
import FestivalBanner from "./components/FestivalBanner";
import FeaturedTemples from "./components/FeaturedTemples";
import PopularPoojas from "./components/PopularPoojas";
import BookMyPandit from "./components/BookMyPandit";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50">

      <Navbar />

      <HeroSection />

      <FloatingSearch />

      <FestivalBanner />

      <FeaturedTemples />

      <PopularPoojas />

      <BookMyPandit />

      <Testimonials />

      <footer className="bg-orange-700 py-10 text-center text-white">
        <div className="max-w-7xl mx-auto px-6">

          <h3 className="text-2xl font-bold">
            🛕 DivyaArpan
          </h3>

          <p className="mt-3 text-orange-100">
            Connecting devotees with trusted temples, verified pandits and
            authentic spiritual services across India.
          </p>

          <div className="mt-8 border-t border-orange-500 pt-6 text-sm text-orange-100">
            © 2026 DivyaArpan. All Rights Reserved.
          </div>

        </div>
      </footer>

    </main>
  );
}