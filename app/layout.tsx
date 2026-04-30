import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "mathlive/static.css";
import "mathlive/fonts.css";
import "./globals.css";
import { Header } from "@/components/Layout/Header";
import ParticlesComponent from "@/components/ui/particles-bg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proof Lab — Socratic math tutor",
  description:
    "An AI tutor for calculus and proofs that scaffolds your thinking instead of answering for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black relative">
        <ParticlesComponent />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  );
}
