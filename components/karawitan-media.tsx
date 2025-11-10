"use client"

import React from "react"
import Script from "next/script"

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0]
      return id || null
    }
    // youtube.com/watch?v=<id>
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) {
        const v = u.searchParams.get("v")
        return v || null
      }
      // youtube.com/embed/<id> or /shorts/<id>
      const parts = u.pathname.split("/").filter(Boolean)
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts")
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
    }
    return null
  } catch {
    return null
  }
}

export default function KarawitanMedia({
  src,
  alt,
  className,
}: {
  src?: string
  alt: string
  className?: string
}) {
  const id = src ? getYouTubeId(src) : null
  if (id) {
    const embed = `https://www.youtube.com/embed/${id}`
    return (
      <iframe
        src={`${embed}?rel=0`}
        title={alt}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  }
  // TikTok support
  const getTikTokId = (url: string): string | null => {
    try {
      const u = new URL(url)
      if (!u.hostname.includes("tiktok.com")) return null
      const parts = u.pathname.split("/").filter(Boolean)
      // pattern: /@username/video/<id>
      const idxVideo = parts.findIndex((p) => p === "video")
      if (idxVideo >= 0 && parts[idxVideo + 1]) return parts[idxVideo + 1]
      // pattern: /embed/v2/<id> or /embed/<id>
      const idxEmbed = parts.findIndex((p) => p === "embed")
      if (idxEmbed >= 0) {
        const candidate = parts[idxEmbed + 2] || parts[idxEmbed + 1]
        if (candidate) return candidate
      }
      return null
    } catch {
      return null
    }
  }

  const isTikTok = src ? /tiktok\.com|vm\.tiktok\.com/.test(src) : false
  const tikId = src ? getTikTokId(src) : null

  if (isTikTok) {
    if (tikId) {
      return (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${tikId}`}
          title={alt}
          className={className}
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }
    // Fallback to official embed script when id tidak bisa diurai (mis. vm.tiktok.com)
    return (
      <div className={className}>
        <blockquote className="tiktok-embed" cite={src}>
          <section> </section>
        </blockquote>
        <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      </div>
    )
  }

  return <img src={src || "/placeholder.svg"} alt={alt} className={className} />
}