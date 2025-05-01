import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "Page not found",
};

export default function CatchAllPage() {
  notFound();
}
