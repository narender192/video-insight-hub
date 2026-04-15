'use client';

import { useState } from "react";
import { Search, Send } from "lucide-react";
import UploadHero from "../../src/components/UploadHero";
import PreloadedBanner from "../../src/components/PreloadedBanner";
import NextSteps from "../../src/components/NextSteps";
import VideoPlayer from "../../src/components/VideoPlayer";
import { useVideo } from "@/contexts/VideoContext";

const mockResults = [
  { time: "0:02", desc: "Stadium exterior wide shot with crowd gathering", confidence: 92 },
  { time: "0:06", desc: "Players walking side by side onto the pitch", confidence: 88 },
  { time: "0:09", desc: "Ball played forward, attacking run begins", confidence: 85 },
  { time: "0:11", desc: "Striker winds up and hits a powerful shot", confidence: 96 },
  { time: "0:13", desc: "Ball hits the back of the net, crowd erupts", confidence: 94 },
];

export default function SearchPage() {
  const { hasVideo, setVideo, filename } = useVideo();
  const [showBanner, setShowBanner] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [searching, setSearching] = useState(false);

  const handleUpload = (file: File) => setVideo(file);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setResults(mockResults);
    }, 1500);
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Search Moments"
        subtitle="Find specific moments in your video by describing what you're looking for"
        onFileSelect={handleUpload}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8 animate-fade-in">
      {showBanner && filename && (
        <PreloadedBanner filename={filename} onDismiss={() => setShowBanner(false)} />
      )}

      <VideoPlayer compact />

      {/* Search Input */}
      <div className="flex items-center gap-2 border border-border rounded-pill px-4 py-2 mt-4 mb-6 focus-within:border-amber-400 transition-colors bg-card">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Describe a moment to find… e.g. 'someone kicks the ball'"
          className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-muted-foreground min-h-[36px]"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="w-8 h-8 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center transition-all disabled:opacity-40 min-w-[32px] hover:scale-105 active:scale-95"
        >
          <Send className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
      </div>

      {searching && (
        <div className="text-center text-[13px] text-muted-foreground animate-slide-up py-8">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Searching moments…
        </div>
      )}

      {results && (
        <div className="animate-slide-up space-y-3 mb-6">
          <p className="text-[12px] text-muted-foreground">{results.length} moments found</p>
          {results.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-card p-3 md:p-4 flex gap-3 md:gap-4 items-center hover:border-amber-400 transition-all cursor-pointer group hover:shadow-md">
              <div
                className="w-[80px] md:w-[100px] h-[50px] md:h-[60px] rounded-btn shrink-0 group-hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, hsl(${200 + i * 15}, 20%, ${40 + i * 5}%), hsl(${220 + i * 10}, 15%, ${55 + i * 3}%))`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{r.desc}</p>
                <span className="font-mono text-[11px] text-amber-600">{r.time}</span>
              </div>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-pill shrink-0">{r.confidence}%</span>
            </div>
          ))}
        </div>
      )}

      {results && <NextSteps currentPage="/search" />}
    </div>
  );
}
