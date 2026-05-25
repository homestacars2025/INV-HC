import type { Metadata } from "next";
import { Cairo, Inter_Tight } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوابة المستثمرين — هوميستا كارز",
  description: "بوابة المستثمرين لشركة هوميستا لتأجير السيارات في إسطنبول",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" lang="ar" className={`${cairo.variable} ${interTight.variable}`}>
      <body className="antialiased bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
