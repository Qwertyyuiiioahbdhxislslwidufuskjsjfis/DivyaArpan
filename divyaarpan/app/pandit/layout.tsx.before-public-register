import { redirect } from "next/navigation";
import { requireRole } from "../lib/auth";
import LogoutButton from "../components/LogoutButton";

export default async function PanditLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireRole("PANDIT");
  if (!user) redirect("/login?next=/pandit/dashboard");
  return (
    <>
      <div className="flex justify-end border-b border-orange-100 bg-orange-50 px-6 py-3">
        <LogoutButton />
      </div>
      {children}
    </>
  );
}