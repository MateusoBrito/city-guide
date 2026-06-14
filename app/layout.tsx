// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"; 
import { NextAuthProvider } from "@/providers/NextAuthProvider"; // Importe o provedor criado

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "City Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* O NextAuthProvider DEVE envelopar a Navbar e os filhos */}
        <NextAuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}