import AdminAuthShell from "../../components/AdminAuthShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthShell>{children}</AdminAuthShell>;
}
