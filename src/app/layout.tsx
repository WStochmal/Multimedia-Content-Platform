import type { Metadata } from "next";
import "@/_styles/globals.css";

export const metadata: Metadata = {
  title: "Multimedia Content Platform",
  description: "Generated by create next app",
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
