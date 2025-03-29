"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Loader2, ArrowRight, Ruler, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white flex flex-col items-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Condom Recommender
        </h1>
        <p className="text-slate-300 max-w-md mx-auto">Find the perfect fit for comfort and safety</p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-xl border border-slate-800">
        <div className="space-y-6">
          {/* Width Input with Description */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Ruler className="mr-2 h-4 w-4 text-blue-400" />
              <Label className="text-sm font-medium">
                Width ({unit}) <span className="text-slate-400">(Optional)</span>
              </Label>
            </div>
            <p className="text-xs text-slate-400">
              If you don&apos;t know your girth, enter width, and we&apos;ll calculate it for you.
            </p>
            <div className="relative">
              <Input
                type="number"
                value={width}
                onChange={handleWidthChange}
                className="bg-slate-800/70 border-slate-700 focus:border-blue-500 transition-all"
                placeholder="Enter width"
              />
              {isCalculating && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                </div>
              )}
            </div>
          </div>

          {/* Girth Input */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Maximize2 className="mr-2 h-4 w-4 text-blue-400" />
              <Label className="text-sm font-medium">Girth ({unit})</Label>
            </div>
            <Input
              type="number"
              value={girth}
              onChange={(e) => setGirth(Number.parseFloat(e.target.value) || "")}
              className="bg-slate-800/70 border-slate-700 focus:border-blue-500 transition-all"
              placeholder="Enter girth manually or use width"
            />
          </div>

          {/* Length Input */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Minimize2 className="mr-2 h-4 w-4 text-blue-400" />
              <Label className="text-sm font-medium">Length ({unit})</Label>
            </div>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number.parseFloat(e.target.value) || "")}
              className="bg-slate-800/70 border-slate-700 focus:border-blue-500 transition-all"
              placeholder="Enter length"
            />
          </div>

          {/* Unit Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-slate-800/70 border-slate-700">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">Centimeters</SelectItem>
                <SelectItem value="inch">Inches</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fetch Button */}
          <Button
            onClick={fetchCondoms}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding...
              </span>
            ) : (
              <span className="flex items-center">
                Find Condoms
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>

      {error && <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-white">{error}</div>}

      {/* Results Display */}
      <div className="mt-10 w-full max-w-5xl">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {results.length > 0 && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-200">Recommended Products</h2>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((condom, index) => (
                <div key={condom.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-center text-lg font-bold">{condom.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-lg bg-slate-700/50 p-2">
                        <Image
                          src={condom.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt={condom.name}
                          fill
                          className="object-contain p-2 transition-transform duration-300 hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-blue-400">Girth:</span> {condom.girth} cm
                        </p>
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-blue-400">Length:</span> {condom.length} cm
                        </p>
                        <p className="text-sm text-slate-300">
                          <span className="font-medium text-blue-400">Volume:</span>{" "}
                          {calculateVolume(condom.girth, condom.length)} mL
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-slate-700 hover:bg-blue-900/20 hover:text-blue-300 transition-all"
                      >
                        <a href={condom.link} target="_blank" rel="noopener noreferrer">
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

