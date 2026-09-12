import { redirect } from "next/navigation";

export default function PanditEntryPage() {
  redirect("/login?next=/pandit/dashboard");
}
