import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Irfaan Fredericks | Film & TV Producer",
  description:
    "Full service film & TV production and entertainment strategy advisor. Producing content on a global scale with a vast network of reliable partners across various regions.",
  openGraph: {
    title: "Irfaan Fredericks | Film & TV Producer",
    description:
      "Full service film & TV production and entertainment strategy advisor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0A0A0A] text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
