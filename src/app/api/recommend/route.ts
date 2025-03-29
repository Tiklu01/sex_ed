/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const girth = parseFloat(searchParams.get("girth") || "0");
    const length = parseFloat(searchParams.get("length") || "0");

    if (!girth || !length) {
      return NextResponse.json({ error: "Invalid input. Please enter valid measurements." }, { status: 400 });
    }

    console.log(`Fetching condoms for girth: ${girth} cm, length: ${length} cm`);

    // Fetch condom data from the external API
    const condomResponse = await fetch("https://dstats.calcsd.info/api/v0/condoms");

    if (!condomResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch condom data." }, { status: 500 });
    }

    const condomList = await condomResponse.json();

    // Filter suitable condoms based on user input
    const matchedCondoms = condomList
      .filter((condom: any) => {
        const girthDiff = Math.abs(condom.girth - girth);
        const lengthDiff = Math.abs(condom.length - length);
        return girthDiff < 1.5 && lengthDiff < 3; // Allow small tolerance
      })
      .sort((a: any, b: any) => Math.abs(a.girth - girth) - Math.abs(b.girth - girth));

    if (matchedCondoms.length === 0) {
      return NextResponse.json({ message: "No suitable condom found." }, { status: 404 });
    }

    // Fetch images for each matched condom
    const condomsWithImages = await Promise.all(
      matchedCondoms.map(async (condom: { id: string }) => {
        try {
          const imageResponse = await fetch(`https://dstats.calcsd.info/api/v0/condom/${condom.id}`, {
            headers: { Accept: "image/jpeg" },
          });

          if (!imageResponse.ok) {
            console.warn(`Failed to fetch image for ${condom.id}`);
            return { ...condom, imageUrl: null };
          }

          const imageBuffer = await imageResponse.arrayBuffer();
          const base64Image = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString("base64")}`;

          return { ...condom, imageUrl: base64Image };
        } catch (error) {
          console.error(`Error fetching image for ${condom.id}:`, error);
          return { ...condom, imageUrl: null };
        }
      })
    );

    return NextResponse.json(condomsWithImages);
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
