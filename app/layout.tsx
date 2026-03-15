import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optimity Express",
  description: "Local vendor marketplace directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}