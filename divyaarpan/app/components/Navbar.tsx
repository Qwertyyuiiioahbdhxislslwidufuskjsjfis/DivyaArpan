"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, UsersRound, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/temples", label: "Temples" },
  { href: "/poojas", label: "Poojas" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Create Account" },
  { href: "/pandit/register", label: "Become a Pandit" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative z-50 border-b border-orange-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[80px] max-w-[1440px] items-center justify-between px-4 lg:min-h-[92px] lg:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#ff5a00] text-[26px] shadow-sm sm:h-[54px] sm:w-[54px] sm:text-[28px]">
            🛕
          </div>
          <div className="leading-none">
            <div className="text-[22px] font-extrabold tracking-tight text-[#e94b00] sm:text-[27px]">
              DivyaArpan
            </div>
            <div className="mt-1 hidden text-[13px] font-medium text-slate-600 sm:block">
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
          className="rounded-lg p-2 text-slate-700 hover:bg-orange-50 hover:text-[#f45112] lg:hidden"
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <nav
          id="customer-navigation"
          aria-label="Customer navigation"
          className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-t border-slate-100 bg-white p-4 shadow-lg lg:static lg:ml-auto lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="whitespace-nowrap rounded-lg px-2.5 py-3 text-[16px] font-medium text-slate-700 transition-all duration-200 hover:bg-orange-50 hover:text-[#f45112]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/my-bookings"
            onClick={closeMenu}
            className={`ml-0 flex h-[52px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[13px] border border-[#ff5a00] px-4 text-[16px] font-semibold text-[#f45112] transition-all duration-200 hover:bg-orange-50 hover:shadow-sm lg:ml-2 ${
              pathname === "/my-bookings" || pathname.startsWith("/my-bookings/") ? "bg-orange-50 shadow-sm" : ""
            }`}
          >
            <UserRound className="h-5 w-5" />
            My Bookings
          </Link>

          <Link
            href="/book-my-pandit"
            onClick={closeMenu}
            className={`ml-0 flex h-[52px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[13px] bg-[#f45112] px-5 py-3 text-[16px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#e94b00] hover:shadow-md lg:ml-1 ${
              pathname === "/book-my-pandit" || pathname.startsWith("/book-my-pandit/") ? "-translate-y-[1px] bg-[#e94b00] shadow-md" : ""
            }`}
          >
            <UsersRound className="h-5 w-5 shrink-0" />
            Book My Pandit
          </Link>
        </nav>
      </div>
    </header>
  );
}
