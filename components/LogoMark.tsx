export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#2A7D6E" />
      <path d="M20 10H38L47 19V51A3 3 0 0 1 44 54H20A3 3 0 0 1 17 51V13A3 3 0 0 1 20 10Z" fill="#FFFFFF" />
      <path d="M38 10V16A3 3 0 0 0 41 19H47Z" fill="#A7D3C9" />
      <rect x="22" y="16" width="11" height="3" rx="1.5" fill="#2A7D6E" />
      <rect x="22" y="22" width="18" height="3" rx="1.5" fill="#2A7D6E" fillOpacity="0.45" />
      <path d="M21 50L30.6 30H33.4L43 50Z" fill="#2A7D6E" />
      <rect x="31.45" y="32.5" width="1.1" height="2.6" rx="0.55" fill="#FFFFFF" />
      <rect x="31.2" y="37.6" width="1.6" height="3.4" rx="0.8" fill="#FFFFFF" />
      <rect x="30.9" y="43.4" width="2.2" height="4.4" rx="1.1" fill="#FFFFFF" />
    </svg>
  );
}
