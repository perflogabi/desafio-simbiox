type DiamondIconProps = {
  size?: number;
};

export function DiamondIcon({ size = 10 }: DiamondIconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 0.7 11.3 6 6 11.3 0.7 6 6 0.7Z" fill="currentColor" />
    </svg>
  );
}
