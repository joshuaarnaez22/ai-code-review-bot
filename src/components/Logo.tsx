interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      {/* Hexagon background */}
      <path
        d="M16 2L28.12 9V23L16 30L3.88 23V9L16 2Z"
        fill="url(#logoGrad)"
        fillOpacity="0.15"
        stroke="url(#logoGrad)"
        strokeWidth="1.5"
      />

      {/* Code brackets */}
      <path
        d="M11 12L8 16L11 20"
        stroke="#818cf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12L24 16L21 20"
        stroke="#818cf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Checkmark spark */}
      <path
        d="M13.5 16.5L15.5 18.5L19 14"
        stroke="#a78bfa"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={32} />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Review<span className="text-indigo-500">Bot</span>
      </span>
    </div>
  )
}
