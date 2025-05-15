import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/contexts/AuthContext";
import { Providers } from "./providers";
import AuthGuard from "@/components/AuthGuard";
import AnimatedPage from "@/components/AnimatedPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockFlow - Sistema de Gerenciamento de Estoque",
  description: "Sistema de controle de entrada e saída de estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <AuthProvider>
            <AuthGuard>
              <AnimatedPage>{children}</AnimatedPage>
            </AuthGuard>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

// Tailwind animation (adicione em globals.css):
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
// .animate-fade-in { animation: fade-in 0.3s; }
