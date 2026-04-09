import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Goliath Investment Group — Institutional Research",
    template: "%s | Goliath Investment Group",
  },
  description:
    "Institutional-grade equity research, macro commentary, and market intelligence.",
  openGraph: {
    title: "Goliath Investment Group",
    description:
      "Institutional-grade equity research, macro commentary, and market intelligence.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goliath Investment Group",
    description:
      "Institutional-grade equity research, macro commentary, and market intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#faf8f5] text-[#1a1a2e]">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
