import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from '@/lib/prisma'
import Navbar from "@/components/Navbar";
import ParticlesBackground from '@/components/ParticlesBackground';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammed Noufal - Cloud Systems Engineer",
  description: "Portfolio of Muhammed Noufal, Cloud Systems Engineer specializing in AWS, Azure, and DevOps.",
};

const THEMES: Record<string, { primary: string; secondary: string }> = {
  purple: { primary: '168, 85, 247', secondary: '34, 211, 238' }, // #a855f7, #22d3ee
  blue: { primary: '59, 130, 246', secondary: '236, 72, 153' }, // blue-500, pink-500
  green: { primary: '34, 197, 94', secondary: '168, 85, 247' }, // green-500, purple-500
  orange: { primary: '249, 115, 22', secondary: '59, 130, 246' }, // orange-500, blue-500
  red: { primary: '239, 68, 68', secondary: '234, 179, 8' },  // red-500, yellow-500
  pink: { primary: '236, 72, 153', secondary: '34, 211, 238' }, // pink-500, cyan-400
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, externalPages] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.externalPage.findMany({ orderBy: { order: 'asc' } }) // Ensure ordering
  ])

  const themeColor = profile?.themeColor || 'purple'
  const theme = THEMES[themeColor] || THEMES.purple

  console.log('Current Theme:', themeColor, theme); // Debugging

  return (
    <html lang="en" suppressHydrationWarning style={{
      '--primary-rgb': theme.primary,
      '--secondary-rgb': theme.secondary,
    } as React.CSSProperties}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-100 selection:bg-white/30`}
      >
        <ParticlesBackground />
        <Navbar logoUrl={profile?.logoUrl} profileName={profile?.fullName} externalPages={externalPages} />
        {children}
      </body>
    </html>
  );
}
