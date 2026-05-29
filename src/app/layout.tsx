import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "LyraPhi - JLPT Practice",
  description: "Japanese Language Proficiency Test practice exams",
};

const themeScript = `
(function(){
  try{
    var t=localStorage.getItem('theme');
    if(t==='dark'||((!t)&&window.matchMedia('(prefers-color-scheme:dark)').matches)){
      document.documentElement.classList.add('dark');
    }
  }catch(e){}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="antialiased">
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
