interface BurgerIconProps {
  className?: string
}

export function BurgerIcon({ className }: BurgerIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top bun */}
      <path
        d="M4 11C4 8.23858 7.58172 6 12 6C16.4183 6 20 8.23858 20 11H4Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Patty */}
      <rect x="3" y="13" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      {/* Bottom bun */}
      <path
        d="M4 18H20C20 19.6569 16.4183 21 12 21C7.58172 21 4 19.6569 4 18Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  )
}
