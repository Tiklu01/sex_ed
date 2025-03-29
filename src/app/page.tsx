
"use client";

import { useState } from "react";
import Image from "next/image";

export default function CondomRecommender() {
  const [girth, setGirth] = useState<number | "">("");
  const [width, setWidth] = useState<number | "">("");
  const [length, setLength] = useState<number | "">("");
  const [unit, setUnit] = useState("cm");

  interface Condom {
    id: string;
    name: string;
    girth: number;
    length: number;
    imageUrl: string;
    link: string;
  }

  const [results, setResults] = useState<Condom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToCm = (value: number) => (unit === "inch" ? value * 2.54 : value);
  const convertToGirth = (w: number) => (Math.PI * w).toFixed(2);
  const calculateVolume = (g: number, l: number) => ((Math.PI * (g / Math.PI) ** 2 * l) / 1000).toFixed(2);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const w = parseFloat(e.target.value);
    setWidth(w || ""); // If input is empty, set to empty string
    if (!isNaN(w)) {
      setGirth(parseFloat(convertToGirth(w))); // Auto-update girth based on width
    }
  };

  const fetchCondoms = async () => {
    setLoading(true);
    setError(null);
    const girthCm = convertToCm(Number(girth));
    const lengthCm = convertToCm(Number(length));

    try {
      const res = await fetch(`/api/recommend?girth=${girthCm}&length=${lengthCm}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch data");
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Condom Recommender</h1>
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-md">
        
        {/* Width Input with Description */}
        <label className="block mb-2">Width ({unit}) <span className="text-gray-400">(Optional)</span></label>
        <p className="text-sm text-gray-400 mb-2">If you don&apos;t know your girth, enter width, and we&apos;ll calculate it for you.</p>
        <input
          type="number"
          value={width}
          onChange={handleWidthChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter width if you don't know girth"
        />

        {/* Girth Input */}
        <label className="block mt-4 mb-2">Girth ({unit})</label>
        <input
          type="number"
          value={girth}
          onChange={(e) => setGirth(parseFloat(e.target.value) || "")}
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter girth manually or use width"
        />

        {/* Length Input */}
        <label className="block mt-4 mb-2">Length ({unit})</label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(parseFloat(e.target.value) || "")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        {/* Unit Selection */}
        <label className="block mt-4">Unit</label>
        <select
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="cm">Centimeters</option>
          <option value="inch">Inches</option>
        </select>

        {/* Fetch Button */}
        <button onClick={fetchCondoms} className="mt-4 bg-blue-500 hover:bg-blue-600 transition p-2 w-full rounded">
          Find Condoms
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Results Display */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((condom) => (
          <div key={condom.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
            <Image
              src={condom.imageUrl}
              alt={condom.name}
              width={150}
              height={150}
              className="rounded"
            />
            <h2 className="text-lg font-bold mt-2">{condom.name}</h2>
            <p className="text-sm">Girth: {condom.girth} cm | Length: {condom.length} cm</p>
            <p className="text-sm">Volume: {calculateVolume(condom.girth, condom.length)} mL</p>
            <a href={condom.link} target="_blank" className="text-blue-400 mt-2">View Product</a>
          </div>
        ))}
      </div>
    </div>
  );
}
