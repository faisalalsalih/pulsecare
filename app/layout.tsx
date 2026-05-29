import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const Sans = Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "PulseCare",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", Sans.variable)}>
      <body className={cn("min-h-screen bg-dark-300 font-sans antialiased", Sans.variable)}>{children}</body>
    </html>
  );
}


