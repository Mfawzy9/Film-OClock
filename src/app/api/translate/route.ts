import { NextRequest, NextResponse } from "next/server";

const rapidApiKey = process.env.RAPIDAPI_KEY;

// cache to prevent duplicate requests
const memoryCache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    const { q, from = "en", to = "ar" } = await req.json();
    if (!q) {
      return NextResponse.json({ error: "Missing text (q)" }, { status: 400 });
    }

    const cacheKey = `${from}-${to}-${q}`;
    if (memoryCache.has(cacheKey)) {
      return NextResponse.json({
        data: { translations: [{ translatedText: memoryCache.get(cacheKey) }] },
      });
    }

    // ------------------ 1. Try RapidAPI Google Translate ------------------
    const googleResponse = await fetch(
      "https://google-translator9.p.rapidapi.com/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": rapidApiKey!,
          "x-rapidapi-host": "google-translator9.p.rapidapi.com",
        },
        body: JSON.stringify({
          q,
          source: from,
          target: to,
          format: "text",
        }),
      },
    );

    if (googleResponse.ok) {
      const data = await googleResponse.json();
      const translatedText = data?.data?.translations?.[0]?.translatedText;
      if (translatedText) {
        memoryCache.set(cacheKey, translatedText);
        return NextResponse.json({
          data: { translations: [{ translatedText }] },
        });
      }
    }

    // ------------------ 2. Fallback to MyMemory Translate ------------------
    const myMemoryResponse = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${from}|${to}`,
    );

    if (myMemoryResponse.ok) {
      const data = await myMemoryResponse.json();
      const fallbackText = data?.responseData?.translatedText || q;
      memoryCache.set(cacheKey, fallbackText);

      return NextResponse.json({
        data: { translations: [{ translatedText: fallbackText }] },
      });
    }

    return NextResponse.json({ error: "Translation failed." }, { status: 500 });
  } catch (error) {
    console.error("[TRANSLATE ERROR]", error);
    return NextResponse.json({ error: "Translation failed." }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const body = await req.json();

//   const { q, from = "en", to = "ar" } = body;

//   const rapidApiKey = process.env.RAPIDAPI_KEY;

//   if (!rapidApiKey) {
//     return NextResponse.json(
//       { error: "Missing RapidAPI Key" },
//       { status: 500 },
//     );
//   }

//   const response = await fetch("https://google-translator9.p.rapidapi.com/v2", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-rapidapi-host": "google-translator9.p.rapidapi.com",
//       "x-rapidapi-key": rapidApiKey,
//     },
//     body: JSON.stringify({
//       q,
//       source: from,
//       target: to,
//       format: "text",
//     }),
//   });

//   const data = await response.json();

//   return NextResponse.json(data);
// }
