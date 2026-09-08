import React from "react";

interface WordmarkProps {
  className?: string;
  textSize?: string;
  color?: string;
}

export default function Wordmark({ 
  className = "",
  textSize = "text-2xl",
  color = "text-slate-900 dark:text-white"
}: WordmarkProps) {
  return (
    <span 
      className={`font-sans font-extrabold tracking-tight ${textSize} ${color} select-none ${className}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}
    >
      Revora
    </span>
  );
}