import * as React from "react"

export const Slider = ({ value, onChange, min = 0, max = 100, step = 1, className }: any) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onChange([parseFloat(e.target.value)])}
      className={`w-full h-2 bg-[#0f212e] rounded-lg appearance-none cursor-pointer accent-primary ${className}`}
    />
  )
}
