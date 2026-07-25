import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abstract Submissions",
};

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}