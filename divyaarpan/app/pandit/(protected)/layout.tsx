import { redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "../../lib/auth";
import LogoutButton from "../../components/LogoutButton";

export default async function PanditLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole("PANDIT");
  if (!user) redirect("/login?next=/pandit/dashboard");
  return (
    <>
      <nav className="border-b border-orange-100 bg-orange-50 px-4 py-3 sm:px-6" aria-label="Pandit portal navigation">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <Link href="/pandit/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-100">
            Dashboard
          </Link>
          <Link href="/pandit/dashboard/requests" className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-100">
            Booking Requests
          </Link>
          <Link href="/pandit/bookings" className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-100">
            My Bookings
          </Link>
          <Link href="/pandit/notifications" className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-100">
            Notifications
          </Link>
          <Link href="/pandit/profile" className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-800 transition hover:bg-orange-100">
            My Profile
          </Link>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}