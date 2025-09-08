"use client"
import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react" // fallback icon

type SafeImageProps = {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackIconSize?: number
}

export default function AvatarImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackIconSize = 32,
}: SafeImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 ${className}`}
        style={{ width, height }}
      >
        <ImageOff
          className="text-gray-400"
          size={fallbackIconSize}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setError(true)}
      className={className}
    />
  )
}

