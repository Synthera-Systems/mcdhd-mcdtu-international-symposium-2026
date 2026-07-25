import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors & Partners",
};

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}