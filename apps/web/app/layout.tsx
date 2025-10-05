import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/providers/app-providers";
import { getServerSession } from "@/lib/auth/supabase-server";
import { cn } from "@quillborn/ui";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "QuillBorn — Narrative OS",
  description: "Collaborative AI writing studio for structured storytelling.",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-sans antialiased bg-background text-foreground")}> 
        <AppProviders initialSession={session}>{children}</AppProviders>
      </body>
    </html>
  );
}
