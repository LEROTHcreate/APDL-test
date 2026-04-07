export default function ThorMark() {
  return (
    <div className="relative size-10 rounded-xl shadow-soft overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(14px_14px_at_30%_25%,hsl(var(--accent)/0.95),transparent_55%),linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary)/0.75))]" />

      <svg
        className="relative z-10 size-10 p-2 text-white/95"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 7h12M12 7v12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M16.8 9.2c.9.9 1.45 2.12 1.45 3.48 0 2.76-2.24 5-5 5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="17.7" cy="9.1" r="1.1" fill="currentColor" opacity="0.95" />
      </svg>
    </div>
  );
}
