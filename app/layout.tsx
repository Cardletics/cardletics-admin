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
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#f5f6fa",
        }}
      >
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1, padding: "32px" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}