import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jhummka - Gold Jewelry",
  description: "Beautiful gold jhumka earrings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7121561674177540"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
} 
