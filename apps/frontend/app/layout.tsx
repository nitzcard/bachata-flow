import type { Metadata } from "next";
import "./globals.css";
import InstallPrompt from "./InstallPrompt";

export const metadata: Metadata = {
  title: "Bachata Flow",
  description: "Explor moves",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="text-3xl font-bold underline">this is footer</footer>
        <InstallPrompt />
      </body>
    </html>
  );
}
