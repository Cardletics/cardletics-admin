"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/revenue", label: "Revenue" },
  { href: "/analytics", label: "Analytics" },
  { href: "/game-data", label: "Game Data" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(path: string) {
    return pathname === path;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      {/* Mobile Topbar */}
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

      {/* Desktop Sidebar */}
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

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu} />
      )}

      {/* Mobile Drawer */}
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