import React from "react";

interface LettermarkProps {
  className?: string;
  color?: string;
}

export default function Lettermark({
  className = "h-8 w-8",
  color = "#0F8F83",
}: LettermarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      {/* Outer Bounding Circle */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={color}
        strokeWidth="8"
      />

      {/* Upright, Seamless "R" Lettermark */}
      <path
        d="M 20 78 C 26 68, 32 54, 32 38 C 32 24, 44 18, 54 18 C 68 18, 70 30, 66 38 C 61 46, 48 48, 40 48 C 50 48, 58 56, 64 66 C 70 76, 76 78, 80 78"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}