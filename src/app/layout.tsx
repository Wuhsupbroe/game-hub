import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meadow Protocol | Game Hub",
  description: "Schedule, review, and chat about your video game sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${spaceGrotesk.variable} ${beVietnam.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-background min-h-screen relative overflow-x-hidden font-body-sm selection:bg-primary/30 text-on-surface">
        {/* We will conditionally hide Navbar if on Auth logic, but they provided a Social hub so maybe we modify Navbar to look like the Header in Social Hub */}
        <Navbar />
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
