// dashboard-wrapper.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

import { redirect } from "next/navigation";
import Dashboard from "@/app/Dashboard/page";

export default async function DashboardWrapper() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  return <Dashboard />;
}
