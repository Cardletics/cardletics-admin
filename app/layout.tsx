import "./globals.css";

export const metadata = {
  title: "Cardletics",
  description: "Cardletics Website",
  icons: {
    icon: "/favicon.png", // ← DAS ist dein Tab-Icon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}