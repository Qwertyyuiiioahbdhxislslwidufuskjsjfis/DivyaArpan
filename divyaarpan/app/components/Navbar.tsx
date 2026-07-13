import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">🛕 DivyaArpan</h1>

        <div className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/temples">Temples</Link>
          <Link href="/pooja">Pooja</Link>
          <Link href="/donate">Donate</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <Link
  href="/login"
  className="bg-white text-orange-600 px-4 py-2 rounded-lg"
>
  Login
</Link>

      </div>
    </nav>
  );
}
