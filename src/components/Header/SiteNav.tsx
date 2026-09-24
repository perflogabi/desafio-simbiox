"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StarIcon } from "@/components/icons/StarIcon";
import { useFavorites } from "@/hooks/useFavorites";
import { formatFavoriteCount } from "@/lib/favoriteCards";
import styles from "./Header.module.css";

export function SiteNav() {
  const pathname = usePathname();
  const onFavorites = pathname === "/favoritos";
  const { cards } = useFavorites();
  const count = cards.length;

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
        {count > 0 ? (
          <>
            <span className={styles.count} aria-hidden="true">
              {count}
            </span>
            <span className="visuallyHidden">{`, ${formatFavoriteCount(count)}`}</span>
          </>
        ) : null}
      </Link>
    </nav>
  );
}
