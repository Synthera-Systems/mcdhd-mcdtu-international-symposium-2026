import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Action Required",
};

export default function ActionTokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}