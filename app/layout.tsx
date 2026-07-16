import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";

export const metadata: Metadata = {
  title: "Revora — The Stripe-native Retention Platform",
  description:
    "Revora turns subscription cancellations into recovered revenue with personalized retention flows, offers, exit surveys, and analytics — built natively for Stripe.",
  openGraph: {
    title: "Revora — The Stripe-native Retention Platform",
    description:
      "Turn cancellations into recovered revenue. Built for subscription businesses running on Stripe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
