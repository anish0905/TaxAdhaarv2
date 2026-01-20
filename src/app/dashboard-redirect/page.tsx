"use client"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any).role;
      if (role === "admin") router.push("/admin");
      else if (role === "sales") router.push("/sales");
      else if (role === "staff") router.push("/staff/dashboard");
      else router.push("/dashboard");
    }
  }, [status, session, router]);

  return <p className="text-center mt-10">Redirecting to your dashboard...</p>;
}