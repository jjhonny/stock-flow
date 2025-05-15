"use client";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const isPublic = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublic) {
      setRedirecting(true);
      router.replace("/login");
    } else {
      setRedirecting(false);
    }
  }, [isAuthenticated, loading, isPublic, router]);

  // Só renderiza children se:
  // - loading terminou E
  // - (autenticado OU rota pública)
  if (loading || redirecting) return <Loading />;
  if (!isAuthenticated && !isPublic) return null;
  return <>{children}</>;
} 