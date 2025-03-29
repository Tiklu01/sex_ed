"use client";

import { useState } from "react";
import Image from "next/image";

export default function CondomRecommender() {
  const [girth, setGirth] = useState(0);
  const [length, setLength] = useState(0);
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
  const [error, setError] = useState<string | null>(null); // ✅ Fix TS error

  const convertToCm = (value: number) => (unit === "inch" ? value * 2.54 : value);
  const calculateVolume = (g: number, l: number) => ((Math.PI * (g / Math.PI) ** 2 * l) / 1000).toFixed(2);

  const fetchCondoms = async () => {
    setLoading(true);
    setError(null);
    const girthCm = convertToCm(girth);
    const lengthCm = convertToCm(length);

    try {
      const res = await fetch(`/api/recommend?girth=${girthCm}&length=${lengthCm}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No suitable condom found.");
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
        <label className="block mb-2">Girth ({unit})</label>
                <input 
          type="number" 
          value={girth || ""} // Ensure empty string instead of NaN
          onChange={(e) => setGirth(parseFloat(e.target.value) || 0)} 
          className="w-full p-2 rounded bg-gray-700 text-white" 
        />      
        <label className="block mt-4 mb-2">Length ({unit})</label>
        <input 
          type="number" 
          value={length || ""} 
          onChange={(e) => setLength(parseFloat(e.target.value) || 0)} 
          className="w-full p-2 rounded bg-gray-700 text-white" 
        />
        <label className="block mt-4">Unit</label>
        <select onChange={(e) => setUnit(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white">
          <option value="cm">Centimeters</option>
          <option value="inch">Inches</option>
        </select>
        
        <button onClick={fetchCondoms} className="mt-4 bg-blue-500 p-2 w-full rounded">Find Condoms</button>
      </div>
      
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((condom) => (
          <div key={condom.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
            <Image src={condom.imageUrl} alt={condom.name} width={150} height={150} className="rounded" />
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
