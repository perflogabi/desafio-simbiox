"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StarIcon } from "@/components/icons/StarIcon";
import styles from "./Header.module.css";

export function SiteNav() {
  const pathname = usePathname();
  const onFavorites = pathname === "/favoritos";

  return (
    <nav className={styles.nav} aria-label="Seções">
      <Link
        href="/favoritos"
        className={styles.link}
        aria-current={onFavorites ? "page" : undefined}
      >
        <span className={styles.star}>
          <StarIcon filled={onFavorites} />
        </span>
        <span className={styles.label}>Favoritos</span>
      </Link>
    </nav>
  );
}
