export default function MilitaryCharacter() {
  return (
    <div className="relative w-24 h-32">
      {/* Head */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-olive-800 rounded-full border-2 border-olive-900">
        {/* Helmet */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-18 h-8 bg-olive-900 rounded-t-full"></div>

        {/* Face */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-6 bg-tan-500 rounded-md">
          {/* Eyes */}
          <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
          <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>

          {/* Mouth */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Body */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-16 bg-olive-700 rounded-md border-2 border-olive-800">
        {/* Uniform Details */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-8 bg-olive-800 rounded-md"></div>

        {/* Medals */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
      </div>

      {/* Arms */}
      <div className="absolute top-18 left-0 w-4 h-12 bg-olive-700 rounded-full"></div>
      <div className="absolute top-18 right-0 w-4 h-12 bg-olive-700 rounded-full"></div>

      {/* Animation */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full h-full animate-pulse opacity-0">
        <div className="w-full h-full bg-white/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}
