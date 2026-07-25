import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invited Speakers",
};

export default function SpeakersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}