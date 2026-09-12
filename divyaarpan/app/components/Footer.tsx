import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#7a2b00] py-12 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              DivyaDarpan
            </Link>
            <p className="mt-3 max-w-xl text-sm leading-7 text-orange-100">
              A spiritual platform connecting devotees with trusted temple rituals, pooja services, and guided support.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-orange-100">
            <Link href="/temples" className="transition hover:text-white">Temples</Link>
            <Link href="/poojas" className="transition hover:text-white">Poojas</Link>
            <Link href="/book-my-pandit" className="transition hover:text-white">Book My Pandit</Link>
            <Link href="/my-bookings" className="transition hover:text-white">My Bookings</Link>
            <Link href="/pandit/register" className="transition hover:text-white">Become a Pandit</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-orange-500/60 pt-6 text-sm text-orange-100">
          © 2026 DivyaDarpan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
