import Link from "next/link";
import { DiamondIcon } from "@/components/icons/DiamondIcon";
import styles from "./Header.module.css";
import { SiteNav } from "./SiteNav";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <DiamondIcon />
          Explorador de Cartas
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
