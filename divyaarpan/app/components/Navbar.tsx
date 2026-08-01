"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Temples", href: "/temples" },
    { name: "Poojas", href: "/pooja" },
    { name: "Donate", href: "/donate" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-2xl shadow-lg">
            🛕
          </div>

          <div>
            <h1
              className={`text-2xl font-extrabold ${
                scrolled ? "text-orange-700" : "text-white"
              }`}
            >
              DivyaArpan
            </h1>

            <p
              className={`text-xs ${
                scrolled ? "text-gray-500" : "text-orange-100"
              }`}
            >
              Divine Services Platform
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-medium transition hover:text-orange-500 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/admin"
            className={`rounded-xl px-5 py-2 border transition ${
              scrolled
                ? "border-orange-600 text-orange-600 hover:bg-orange-50"
                : "border-white text-white hover:bg-white hover:text-orange-600"
            }`}
          >
            Admin
          </Link>

          <Link
            href="/book-my-pandit"
            className="rounded-xl bg-orange-600 px-6 py-3 text-white font-semibold hover:bg-orange-700 transition shadow-lg"
          >
            Book My Pandit
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className={`lg:hidden ${
            scrolled ? "text-orange-700" : "text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white shadow-xl border-t">
          <div className="flex flex-col p-6 gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 font-medium hover:text-orange-600"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/book-my-pandit"
              className="mt-3 rounded-xl bg-orange-600 py-3 text-center text-white font-semibold"
            >
              Book My Pandit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}