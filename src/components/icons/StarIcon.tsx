type StarIconProps = {
  filled: boolean;
};

export function StarIcon({ filled }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.1 14.8 8.8 21 9.7 16.5 14 17.6 20.2 12 17.2 6.4 20.2 7.5 14 3 9.7 9.2 8.8 12 3.1Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
