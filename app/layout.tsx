import "./globals.css";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Cardletics",
  description: "Cardletics Website",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body style={bodyStyle}>
        <div style={pageShellStyle}>
          <div style={contentStyle}>{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

const bodyStyle: React.CSSProperties = {
  margin: 0,
  background: "#0b0f0d",
};

const pageShellStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
};