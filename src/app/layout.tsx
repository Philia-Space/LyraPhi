import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LyraPhi - JLPT Practice",
  description: "Japanese Language Proficiency Test practice exams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
