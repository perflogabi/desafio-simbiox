"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Explorar" },
  { href: "/favoritos", label: "Favoritos" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Seções">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles.link}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
