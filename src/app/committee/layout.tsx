import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizing Committee",
};

export default function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}