"use client"

import Link from "next/link"
import React, { useEffect, useRef } from "react"
import { Button } from "./ui/button"
import Image from "next/image"

const HeroSection = () => {
  const imageRef = useRef(null)

  useEffect(() => {
    const imageElement = imageRef.current
    if (!imageElement) return

    const handleScroll = () => {
      if (window.scrollY > 100) {
        imageElement.classList.add("scrolled")
      } else {
        imageElement.classList.remove("scrolled")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        {/* Add pb-1 to prevent "g" from getting cut */}
        <h1 className="hero-title pb-1">
          Smart finance.<br />
          Built for intelligent decisions.
        </h1>

        <p className="hero-subtitle">
          FINA helps you track, analyze, and optimize your finances using AI.
          Make smarter money decisions with real-time insights.
        </p>

        <div className="flex justify-center space-x-4">

          <Link href="/dashboard">
            <button className="mt-2 px-8 py-3 rounded-xl bg-black text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
              Get Started
            </button>
          </Link>

        </div>
      </div>

      <div className="hero-image-wrapper">
        <div ref={imageRef} className="hero-image">
          <Image
            src="/hero.png"
            width={1200}
            height={1280}
            alt="Dashboard Preview"
            className="rounded-lg shadow-2xl border mx-auto"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default HeroSection


