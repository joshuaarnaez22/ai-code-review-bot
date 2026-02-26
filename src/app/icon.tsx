import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Hexagon */}
          <path
            d="M16 2L28.12 9V23L16 30L3.88 23V9L16 2Z"
            fill="#6366f1"
            fillOpacity="0.2"
            stroke="#818cf8"
            strokeWidth="1.5"
          />
          {/* Left bracket */}
          <path d="M11 12L8 16L11 20" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right bracket */}
          <path d="M21 12L24 16L21 20" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Checkmark */}
          <path d="M13.5 16.5L15.5 18.5L19 14" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
