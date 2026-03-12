import { AdminNavbar } from "@/components/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans bg-background min-h-screen">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
