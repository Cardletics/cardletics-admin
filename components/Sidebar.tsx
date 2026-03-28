"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const getLinkStyle = (path: string): React.CSSProperties => {
    const isActive = pathname === path;

    return {
      display: "block",
      padding: "10px 12px",
      borderRadius: "8px",
      textDecoration: "none",
      color: isActive ? "#111827" : "white",
      background: isActive ? "white" : "transparent",
      fontWeight: isActive ? "bold" : "normal",
    };
  };

  return (
    <aside
      style={{
        width: "240px",
        background: "#111827",
        color: "white",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Cardletics Admin</h2>

      <nav style={{ marginTop: "32px" }}>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <li>
            <Link href="/" style={getLinkStyle("/")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/users" style={getLinkStyle("/users")}>
              Users
            </Link>
          </li>
          <li>
            <Link href="/subscriptions" style={getLinkStyle("/subscriptions")}>
              Subscriptions
            </Link>
          </li>

          {/* 🔥 NEU: Revenue */}
          <li>
            <Link href="/revenue" style={getLinkStyle("/revenue")}>
              Revenue
            </Link>
          </li>

          <li>
            <Link href="/analytics" style={getLinkStyle("/analytics")}>
              Analytics
            </Link>
          </li>
          <li>
            <Link href="/game-data" style={getLinkStyle("/game-data")}>
              Game Data
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}