import { DiamondIcon } from "@/components/icons/DiamondIcon";
import styles from "./SectionRule.module.css";

export function SectionRule() {
  return (
    <div className={styles.rule} aria-hidden="true">
      <DiamondIcon size={8} />
    </div>
  );
}
