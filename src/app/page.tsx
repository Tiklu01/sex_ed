"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Loader2, ArrowRight, Ruler, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import "./globals.css"
// Skeleton card component
import SkeletonCard from "@/components/skeleton-card"

export default function CondomRecommender() {
  const [girth, setGirth] = useState<number | "">("")
  const [width, setWidth] = useState<number | "">("")
  const [length, setLength] = useState<number | "">("")
  const [unit, setUnit] = useState("cm")
  const [isCalculating, setIsCalculating] = useState(false)

  interface Condom {
    id: string
    name: string
    girth: number
    length: number
    imageUrl: string
    link: string
  }

  const [results, setResults] = useState<Condom[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convertToCm = (value: number) => (unit === "inch" ? value * 2.54 : value)
  const convertToGirth = (w: number) => (Math.PI * w).toFixed(2)
  const calculateVolume = (g: number, l: number) => ((Math.PI * (g / Math.PI) ** 2 * l) / 1000).toFixed(2)

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const w = Number.parseFloat(e.target.value)
    setWidth(w || "") // If input is empty, set to empty string
    if (!isNaN(w)) {
      setIsCalculating(true)
      // Add a small delay to show the calculation animation
      setTimeout(() => {
        setGirth(Number.parseFloat(convertToGirth(w)))
        setIsCalculating(false)
      }, 300)
    }
  }

  const fetchCondoms = async () => {
    setLoading(true)
    setError(null)
    const girthCm = convertToCm(Number(girth))
    const lengthCm = convertToCm(Number(length))

    try {
      const res = await fetch(`/api/recommend?girth=${girthCm}&length=${lengthCm}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch data")
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
    setLoading(false)
  }

  return (
    <div className="condom-recommender">
      <h1 className="title">Condom Recommender</h1>
      <p className="subtitle">Find the perfect fit for comfort and safety</p>

      <div className="form-container">
        <div className="form-group">
          <div className="form-label">
            <Ruler className="form-label-icon" size={16} />
            <span>
              Width ({unit}) <span style={{ color: "#94a3b8" }}>(Optional)</span>
            </span>
          </div>
          <p className="form-hint">
            If you don&apos;t know your girth, enter width, and we&apos;ll calculate it for you.
          </p>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              value={width}
              onChange={handleWidthChange}
              className="form-input"
              placeholder="Enter width"
            />
            {isCalculating && (
              <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
                <Loader2 size={16} className="animate-spin" style={{ color: "#60a5fa" }} />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <Maximize2 className="form-label-icon" size={16} />
            <span>Girth ({unit})</span>
          </div>
          <input
            type="number"
            value={girth}
            onChange={(e) => setGirth(Number.parseFloat(e.target.value) || "")}
            className="form-input"
            placeholder="Enter girth manually or use width"
          />
        </div>

        <div className="form-group">
          <div className="form-label">
            <Minimize2 className="form-label-icon" size={16} />
            <span>Length ({unit})</span>
          </div>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number.parseFloat(e.target.value) || "")}
            className="form-input"
            placeholder="Enter length"
          />
        </div>

        <div className="form-group">
          <div className="form-label">Unit</div>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="form-select">
            <option value="cm">Centimeters</option>
            <option value="inch">Inches</option>
          </select>
        </div>

        <button onClick={fetchCondoms} className="form-button" disabled={loading}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center" }}>
              <Loader2 size={16} className="animate-spin" style={{ marginRight: "8px" }} />
              Finding...
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center" }}>
              Find Condoms
              <ArrowRight size={16} className="form-button-icon" />
            </span>
          )}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "rgba(220, 38, 38, 0.5)",
            borderRadius: "0.5rem",
            color: "white",
          }}
        >
          {error}
        </div>
      )}

      {/* Results Display */}
      <div style={{ marginTop: "2.5rem", width: "100%", maxWidth: "80rem" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {results.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    color: "#e2e8f0",
                  }}
                >
                  Recommended Products
                </h2>
              </div>
            )}
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}
            >
              {results.map((condom, index) => (
                <div key={condom.id} className="result-card" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card
                    style={{
                      backgroundColor: "rgba(30, 41, 59, 0.6)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(51, 65, 85, 0.8)",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardHeader style={{ paddingBottom: "0.5rem" }}>
                      <CardTitle style={{ textAlign: "center", fontSize: "1.125rem", fontWeight: "bold" }}>
                        {condom.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          position: "relative",
                          width: "8rem",
                          height: "8rem",
                          marginBottom: "1rem",
                          overflow: "hidden",
                          borderRadius: "0.5rem",
                          backgroundColor: "rgba(51, 65, 85, 0.5)",
                          padding: "0.5rem",
                        }}
                      >
                        <Image
                          src={condom.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt={condom.name}
                          fill
                          style={{ objectFit: "contain", padding: "0.5rem", transition: "transform 0.3s ease" }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div style={{ marginTop: "0.25rem", textAlign: "center" }}>
                        <p style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                          <span style={{ fontWeight: "500", color: "#60a5fa" }}>Girth:</span> {condom.girth} cm
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                          <span style={{ fontWeight: "500", color: "#60a5fa" }}>Length:</span> {condom.length} cm
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                          <span style={{ fontWeight: "500", color: "#60a5fa" }}>Volume:</span>{" "}
                          {calculateVolume(condom.girth, condom.length)} mL
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter style={{ paddingTop: "0.5rem" }}>
                    <Button
                      asChild
                      variant="outline"
                      style={{
                        width: "100%",
                        border: "1px solid rgba(51, 65, 85, 0.8)",
                        color: "#60a5fa",
                        backgroundColor: "transparent",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        textAlign: "center",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.8)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <a href={condom.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", width: "100%" }}>
                        View Product
                      </a>
                    </Button>

                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}