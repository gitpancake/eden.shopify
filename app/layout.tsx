import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Solienne Management Portal",
  description: "Admin portal for Solienne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
