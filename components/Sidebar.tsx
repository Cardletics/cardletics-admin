"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/revenue", label: "Revenue" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/game-data", label: "Game Data" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(path: string) {
    return pathname.startsWith(path);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="mobile-topbar">
        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Menü öffnen"
        >
          ☰
        </button>

        <div className="mobile-topbar-title">Cardletics Admin</div>
      </header>

      <aside className="desktop-sidebar">
        <div className="sidebar-logo">Cardletics Admin</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu} />
      )}

      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-title">Menü</div>
          <button
            type="button"
            className="menu-button"
            onClick={closeMenu}
            aria-label="Menü schließen"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}