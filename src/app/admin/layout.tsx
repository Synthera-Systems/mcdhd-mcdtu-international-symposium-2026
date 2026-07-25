import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7f6] text-primary flex flex-col font-inter">
      {children}
    </div>
  );
}