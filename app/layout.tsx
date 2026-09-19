import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shipora",
  icons: {
    icon: [
      {
        url: "/shipora.png",
        sizes: "250x250",
      },
    ],
    apple: [
      {
        url: "/shipora.png",
        sizes: "250x250",
      },
    ],
  },
  description:
    "La plateforme simple et moderne pour gérer vos opérations logistiques.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${urbanist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-urbanist">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}