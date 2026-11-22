import type { Metadata } from "next";
import { Header, Footer } from "../components/Shell";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://okhockey.de"),
  title: {
    default: "OKHockey – Rink Hockey. Unfiltered.",
    template: "%s | OKHockey",
  },
  description:
    "Unabhängiges Rollhockey-Magazin. Entdecke Tore, Paraden und Geschichten aus der Bundesliga und den internationalen Hallen.",
  openGraph: {
    siteName: "OKHockey",
    locale: "de_DE",
    type: "website",
    images: ["/media/brand.png"],
  },
  icons: { icon: "/media/brand.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <a href="#inhalt" className="skip">
          Zum Inhalt
        </a>
        <Header />
        <main id="inhalt">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
