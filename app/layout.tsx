import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Cardletics Admin",
  description: "Admin Dashboard for Cardletics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <div className="admin-app">
          <Sidebar />
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}