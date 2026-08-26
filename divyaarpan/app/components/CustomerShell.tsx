"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInternalWorkspace = pathname.startsWith("/admin") || pathname.startsWith("/pandit");

  if (isInternalWorkspace) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
