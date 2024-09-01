// dashboard-wrapper.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import { redirect } from "next/navigation";

interface DashboardProtected {
  children: React.ReactNode
}

export default async function DashboardWrapper({ children }: DashboardProtected) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  return (
    <main>
      {children}
    </main>
  );
}
