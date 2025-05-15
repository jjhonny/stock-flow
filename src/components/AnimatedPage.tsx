"use client";
import { usePathname } from "next/navigation";

export default function AnimatedPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="transition-opacity duration-300 animate-fade-in"
      style={{ minHeight: "100vh" }}
    >
      {children}
    </div>
  );
} 