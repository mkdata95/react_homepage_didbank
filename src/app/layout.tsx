import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import "./globals.css";

const nanumGothic = Nanum_Gothic({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={nanumGothic.className}>
      <body>{children}</body>
    </html>
  );
}
