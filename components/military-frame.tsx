import type React from "react"

interface MilitaryFrameProps {
  children: React.ReactNode
  theme?: "light" | "dark"
}

export default function MilitaryFrame({ children, theme = "dark" }: MilitaryFrameProps) {
  const isDark = theme === "dark"

  return (
    <div className="relative">
      {/* Main Frame */}
      <div
        className={`
        relative rounded-lg overflow-hidden shadow-2xl border-2
        ${
          isDark
            ? "bg-gradient-to-b from-olive-800 to-olive-900 border-olive-700"
            : "bg-gradient-to-b from-gray-200 to-gray-300 border-gray-400"
        }
      `}
      >
        {/* Frame Header */}
        <div
          className={`
          py-2 px-4 border-b-2 flex items-center justify-between
          ${isDark ? "bg-olive-950 border-olive-700" : "bg-gray-300 border-gray-400"}
        `}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div
            className={`
            font-military text-lg tracking-wider
            ${isDark ? "text-olive-300" : "text-gray-700"}
          `}
          >
            GOODBOMB
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isDark ? "bg-olive-600" : "bg-gray-400"}`}></div>
            <div className={`w-3 h-3 rounded-full ${isDark ? "bg-olive-600" : "bg-gray-400"}`}></div>
          </div>
        </div>

        {/* Corner Screws */}
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-gray-600"></div>
        </div>
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-gray-600"></div>
        </div>
        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-gray-600"></div>
        </div>
        <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-gray-600"></div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
