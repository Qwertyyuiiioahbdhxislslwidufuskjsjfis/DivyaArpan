import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PendingApprovalPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "PANDIT" || !user.panditId) {
    redirect("/login?next=/pandit/pending-approval");
  }

  const pandit = await prisma.pandit.findUnique({
    where: { id: user.panditId },
    select: { verificationStatus: true },
  });
  if (pandit?.verificationStatus === "VERIFIED") {
    redirect("/pandit/dashboard");
  }

  return (
    <main className="min-h-screen bg-orange-50 px-6 py-16">
      <section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">DivyaArpan Partner Portal</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Application Under Review</h1>
        <p className="mt-4 text-gray-600">Your registration and verification documents have been received. Dashboard access will be available after Admin approval.</p>
        <p className="mt-6 rounded-xl bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-800">Current status: {pandit?.verificationStatus || "PENDING"}</p>
      </section>
    </main>
  );
}