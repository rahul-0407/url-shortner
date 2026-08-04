import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Romer - High Performance URL Infrastructure",
  description: "Turn links into intelligent telemetry streams and real-time click analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;520;600;700&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#070708] text-[#e5e2e3] antialiased selection:bg-[#5E6BFF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
