"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch(`${baseUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = (await res.json()) as { image_url?: string };
      if (!data.image_url) {
        throw new Error("No image_url in response");
      }
      setImageUrl(data.image_url);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-10 py-20 px-6 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">Image-AI</h1>

        <div className="w-full flex flex-col gap-4">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want..."
            className="w-full rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-zinc-900 px-4 py-3 text-base text-black dark:text-zinc-50 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="h-12 rounded-xl bg-black text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-black"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="w-full min-h-[300px] flex items-center justify-center border border-dashed border-black/10 dark:border-white/20 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Generated" className="max-w-full rounded-lg" />
          ) : (
            <span className="text-zinc-500 dark:text-zinc-400">Your image will appear here</span>
          )}
        </div>
      </main>
    </div>
  );
}
