import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CosmicChat } from "@/components/chat/cosmic-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guardians of the Prompt | Welcome to PromptVerse",
  description: "A cinematic AI-powered learning universe where kids and teens use creativity, missions, and digital worlds to build future-ready skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-space-deep text-text-primary antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CosmicChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
