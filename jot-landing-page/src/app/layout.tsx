import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOT — The notes app that deletes your notes.",
  description:
    "JOT turns your messy thoughts into actions — then deletes the note. Reminders, lists, events. All from plain text. Zero friction. Just type it.",
  openGraph: {
    title: "JOT — The notes app that deletes your notes.",
    description:
      "JOT turns your messy thoughts into actions — then deletes the note.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
