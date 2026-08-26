"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, UserRound, UsersRound, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", variant: "link" },
  { href: "/temples", label: "Temples", variant: "link" },
  { href: "/poojas", label: "Poojas", variant: "link" },
  { href: "/astrology", label: "Consult an Astrologer", variant: "button" },
  { href: "/sacred-store", label: "Sacred Store", variant: "button" },
  { href: "/my-bookings", label: "My Bookings", variant: "outline" },
  { href: "/book-my-pandit", label: "Book My Pandit", variant: "primary" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <header className="relative z-50 border-b border-orange-200/80 bg-[#fffaf5]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <div className="flex h-[86px] items-center justify-between gap-3 lg:h-[94px] lg:gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#ff5a00] text-[24px] shadow-sm sm:h-[52px] sm:w-[52px] sm:text-[26px]">
              🛕
            </div>
            <div className="leading-none">
              <div className="text-[22px] font-extrabold tracking-tight text-[#e94b00] sm:text-[27px]">
                DivyaArpan
              </div>
              <div className="mt-1 hidden text-[12px] font-medium text-slate-600 sm:block">
                Sacred Services
              </div>
            </div>
          </Link>

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="customer-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-orange-50 hover:text-[#f45112] lg:hidden"
          >
            {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

          <nav
            id="customer-navigation"
            aria-label="Customer navigation"
            className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-2 border-t border-orange-100 bg-white/95 p-4 shadow-lg lg:static lg:ml-auto lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              if (item.variant === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
                      isActive
                        ? "bg-orange-50 text-[#f45112] shadow-sm ring-1 ring-orange-100"
                        : "text-slate-700 hover:bg-orange-50 hover:text-[#f45112]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              if (item.variant === "button") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="flex h-[48px] items-center gap-2 whitespace-nowrap rounded-[12px] border border-[#ff5a00] bg-white px-4 text-[15px] font-semibold text-[#f45112] transition-all duration-200 hover:bg-orange-50 hover:shadow-sm"
                  >
                    {item.label}
                  </Link>
                );
              }

              if (item.href === "/my-bookings") {
                return (
                  <div key={item.href} className="relative">
                    <div className="flex items-center gap-1">
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex h-[48px] items-center gap-2 whitespace-nowrap rounded-[12px] border border-[#ff5a00] bg-white px-4 text-[15px] font-semibold text-[#f45112] transition-all duration-200 hover:bg-orange-50 hover:shadow-sm"
                      >
                        <UserRound className="h-4 w-4" />
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={isAccountOpen}
                        aria-label="Open account menu"
                        onClick={() => setIsAccountOpen((open) => !open)}
                        className="flex h-[48px] items-center justify-center rounded-[12px] border border-[#ff5a00] bg-white px-2 text-[#f45112] transition-all hover:bg-orange-50"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {isAccountOpen && (
                      <div className="absolute right-0 top-[54px] z-50 w-48 rounded-xl border border-orange-100 bg-white p-2 shadow-xl">
                        <Link
                          href="/login"
                          onClick={closeMenu}
                          className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#f45112]"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={closeMenu}
                          className="block rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#f45112]"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex h-[48px] items-center gap-2 whitespace-nowrap rounded-[12px] bg-[#f45112] px-5 text-[15px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#e94b00] hover:shadow-md"
                >
                  <UsersRound className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
