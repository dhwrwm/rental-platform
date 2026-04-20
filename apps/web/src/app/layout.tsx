import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rental Platform",
  description: "Book stays, manage listings, and access your account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="selection:bg-accent/30 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
