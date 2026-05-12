import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "FirmaCheck — rychlé ověření české firmy",
  description:
    "Ověřte českou firmu podle IČO. Data z ARES, sídlo na mapě, lokální SQLite cache a export uložených firem do CSV/JSON.",
};

// Runs synchronously before React hydration to avoid FOUC for theme + language.
const PREHYDRATION_SCRIPT = `(function(){try{
  var t = localStorage.getItem('firmacheck-theme');
  var d = t === 'dark' || (t == null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (d) document.documentElement.classList.add('dark');
  document.documentElement.dataset.theme = d ? 'dark' : 'light';
  var l = localStorage.getItem('firmacheck-lang');
  if (!l) {
    var nav = (navigator.language || 'cs').toLowerCase();
    l = nav.startsWith('en') ? 'en' : nav.startsWith('de') ? 'de' : 'cs';
  }
  document.documentElement.lang = l;
  document.documentElement.dataset.lang = l;
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      suppressHydrationWarning
      className={`${ubuntu.variable} ${ubuntuMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREHYDRATION_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
