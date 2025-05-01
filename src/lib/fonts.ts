import { Roboto, Righteous, Cairo } from "next/font/google";

export const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const righteous = Righteous({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-righteous",
});

export const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});
