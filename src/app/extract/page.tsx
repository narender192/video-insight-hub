'use client';

import { useState } from "react";
import UploadHero from "../../src/components/UploadHero";
import PreloadedBanner from "../../src/components/PreloadedBanner";
import NextSteps from "../../src/components/NextSteps";
import VideoPlayer from "../../src/components/VideoPlayer";
import { useVideo } from "@/contexts/VideoContext";
import { useToast } from "@/hooks/use-toast";

export default function ExtractPage() {
  const { hasVideo, setVideo, filename } = useVideo();
  const { toast } = useToast();
  const [showBanner, setShowBanner] = useState(true);
  const [extracted, setExtracted] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [interval, setIntervalVal] = useState("2s");
  const [format, setFormat] = useState("JPG");
  const [quality, setQuality] = useState(90);
  const [selectedFrames, setSelectedFrames] = useState<Set<number>>(new Set());

  const handleUpload = (file: File) => setVideo(file);

  const handleExtract = () => {
    setExtracting(true);
    setTimeout(() => {
      setExtracting(false);
      setExtracted(true);
      toast({ title: "Frames extracted", description: `9 frames extracted every ${interval} as ${format} (quality ${quality}%)` });
    }, 2000);
  };

  const toggleFrame = (i: number) => {
    setSelectedFrames(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleDownloadAll = () => {
    toast({ title: "Downloading all frames", description: "Preparing 9 frames as a ZIP archive…" });
  };

  const handleDownloadSelected = () => {
    toast({ title: `Downloading ${selectedFrames.size} frames`, description: `Preparing selected frames as ${format}…` });
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Extract video frames"
        subtitle="Pull keyframes from any video as high-quality images"
        onFileSelect={handleUpload}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 animate-fade-in">
      {showBanner && filename && (
        <PreloadedBanner filename={filename} onDismiss={() => setShowBanner(false)} />
      )}

      <VideoPlayer compact />

      <div className="bg-card border border-border rounded-card p-4 md:p-6 mb-6 mt-4 animate-slide-up">
        <h2 className="text-[15px] font-semibold mb-4">Extraction Settings</h2>
        <div className="flex flex-wrap gap-4 md:gap-6 items-end">
          <div>
            <label className="text-[12px] text-muted-foreground block mb-1">Extract every</label>
            <select
              value={interval}
              onChange={(e) => setIntervalVal(e.target.value)}
              className="border border-border rounded-btn px-3 py-2 text-[13px] bg-card min-h-[44px]"
            >
              <option>1s</option>
              <option>2s</option>
              <option>5s</option>
              <option>Keyframes only</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground block mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="border border-border rounded-btn px-3 py-2 text-[13px] bg-card min-h-[44px]"
            >
              <option>JPG</option>
              <option>PNG</option>
              <option>WEBP</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] text-muted-foreground block mb-1">Quality: {quality}%</label>
            <input
              type="range"
              min="50"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-32 accent-amber-500"
            />
          </div>
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-btn transition-all disabled:opacity-50 min-h-[44px] hover:scale-[1.02] active:scale-[0.98]"
          >
            {extracting ? "Extracting…" : "Extract Frames"}
          </button>
        </div>
      </div>

      {extracted && (
        <div className="animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                onClick={() => toggleFrame(i)}
                className={`aspect-video rounded-btn overflow-hidden relative shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  selectedFrames.has(i) ? "ring-2 ring-amber-500 ring-offset-2" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, hsl(${200 + i * 12}, 20%, ${40 + i * 4}%), hsl(${220 + i * 8}, 15%, ${55 + i * 3}%))`,
                }}
              >
                {selectedFrames.has(i) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
                <span className="absolute bottom-1.5 left-1.5 font-mono text-[10px] bg-foreground/60 text-primary-foreground px-1.5 py-0.5 rounded">
                  0:{String(i * 2).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadAll}
              className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-5 py-2 rounded-btn transition-all min-h-[44px] hover:scale-[1.02]"
            >
              Download all frames
            </button>
            {selectedFrames.size > 0 && (
              <button
                onClick={handleDownloadSelected}
                className="border border-amber-500 text-amber-600 bg-card hover:bg-amber-50 text-[13px] font-medium px-5 py-2 rounded-btn transition-all min-h-[44px] animate-fade-in"
              >
                Download {selectedFrames.size} selected
              </button>
            )}
          </div>
          <NextSteps currentPage="/extract" />
        </div>
      )}
    </div>
  );
}
