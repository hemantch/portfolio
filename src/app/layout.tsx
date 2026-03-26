import type { Metadata } from "next";
import "@fontsource/syne/400.css";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hemanth Chappa | Site Reliability Engineer",
  description:
    "Site Reliability Engineer with 9 years of experience in cloud infrastructure, platform engineering, and distributed systems. Based in Glasgow, UK.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-[#0A0A0F] text-white">{children}</body>
    </html>
  );
}
