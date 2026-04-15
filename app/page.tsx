'use client';

import { useRef, useState, type SyntheticEvent } from "react";
import UploadHero from "../src/components/UploadHero";
import NextSteps from "../src/components/NextSteps";
import VideoPlayer from "../src/components/VideoPlayer";
import VideoDNA from "../src/components/VideoDNA";
import AnalyzeChat from "../src/components/AnalyzeChat";
import { DNASkeleton, FramesSkeleton } from "../src/components/SkeletonLoader";
import { useVideo } from "@/contexts/VideoContext";

const mockScenes = [
  { label: "Scene 1", time: "0:00–0:04" },
  { label: "Scene 2", time: "0:05–0:08" },
  { label: "Scene 3", time: "0:09–0:14" },
];

const TOTAL_DNA_BARS = 28;
const TOTAL_KEYFRAMES = 8;
const DEFAULT_DURATION = 14;

const createRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const uniqueIndices = (indices: number[], max: number) =>
  [...new Set(indices)].filter((index) => index >= 0 && index < max);

const getProgressIndex = (currentTime: number, duration: number, totalItems: number) => {
  const safeDuration = duration > 0 ? duration : DEFAULT_DURATION;
  return Math.min(totalItems - 1, Math.max(0, Math.floor((currentTime / safeDuration) * totalItems)));
};

const getRetrievalMatches = (query: string, activeBar: number, activeFrame: number) => {
  const normalizedQuery = query.toLowerCase();

  if (/(start|begin|intro|opening)/.test(normalizedQuery)) {
    return { bars: createRange(0, 7), frames: [0, 1, 2] };
  }

  if (/(scene change|scene|transition|when)/.test(normalizedQuery)) {
    return { bars: [6, 7, 8, 15, 16, 17], frames: [2, 4, 6] };
  }

  if (/(main|action|describe|middle)/.test(normalizedQuery)) {
    return { bars: createRange(8, 17), frames: [2, 3, 4, 5] };
  }

  if (/(summary|summarize|key|moment|overview)/.test(normalizedQuery)) {
    return { bars: [1, 2, 3, 11, 12, 13, 21, 22, 23], frames: [0, 3, 6] };
  }

  if (/(end|final|finish|outro|last)/.test(normalizedQuery)) {
    return { bars: createRange(20, 27), frames: [5, 6, 7] };
  }

  return {
    bars: [activeBar - 1, activeBar, activeBar + 1, activeBar + 2],
    frames: [activeFrame, activeFrame + 1],
  };
};

export default function AnalyzePage() {
  const { hasVideo, setVideo, filename } = useVideo();
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [retrievedBars, setRetrievedBars] = useState<Set<number>>(new Set());
  const [retrievedFrames, setRetrievedFrames] = useState<Set<number>>(new Set());
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [currentTime, setCurrentTime] = useState(0);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const activeBarIndex = getProgressIndex(currentTime, duration, TOTAL_DNA_BARS);
  const activeFrameIndex = getProgressIndex(currentTime, duration, TOTAL_KEYFRAMES);

  const handleUpload = (file: File) => {
    setVideo(file);
    setIsAnalyzed(false);
    setIsAnalyzing(false);
    setRetrievedBars(new Set());
    setRetrievedFrames(new Set());
    setCurrentTime(0);
    setDuration(DEFAULT_DURATION);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setRetrievedBars(new Set());
    setRetrievedFrames(new Set());
    setCurrentTime(0);

    if (videoElementRef.current) {
      videoElementRef.current.currentTime = 0;
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleRetrieve = (query: string) => {
    const { bars, frames } = getRetrievalMatches(query, activeBarIndex, activeFrameIndex);
    setRetrievedBars(new Set(uniqueIndices(bars, TOTAL_DNA_BARS)));
    setRetrievedFrames(new Set(uniqueIndices(frames, TOTAL_KEYFRAMES)));
  };

  const handleBarClick = (barIndex: number) => {
    const safeDuration = duration > 0 ? duration : DEFAULT_DURATION;
    const nextTime = (barIndex / TOTAL_DNA_BARS) * safeDuration;
    setCurrentTime(nextTime);

    if (!videoElementRef.current) return;

    const shouldResumePlayback = !videoElementRef.current.paused;
    videoElementRef.current.currentTime = nextTime;

    if (shouldResumePlayback) {
      void videoElementRef.current.play().catch(() => undefined);
    }
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const nextDuration = event.currentTarget.duration;
    setDuration(Number.isFinite(nextDuration) && nextDuration > 0 ? nextDuration : DEFAULT_DURATION);
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Analyze your video"
        subtitle="Extract frames, ask questions, and understand any video with AI"
        onFileSelect={handleUpload}
      />
    );
  }

  if (!isAnalyzed && !isAnalyzing) {
    return (
      <div className="animate-fade-in flex flex-col items-center px-4 pb-10 pt-12 md:pt-20">
        <div className="w-full max-w-md rounded-card border border-border bg-card p-6 text-center shadow-sm md:p-8">
          <VideoPlayer compact />
          <p className="mt-3 text-[13px] text-muted-foreground">Ready to analyze</p>
          <button
            onClick={handleAnalyze}
            className="mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-btn bg-primary text-[15px] font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
          >
            ✦ Analyze Video
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="animate-fade-in flex flex-col items-center px-4 pb-10 pt-12 md:pt-20">
        <div className="w-full max-w-md rounded-card border border-border bg-card p-6 text-center shadow-sm md:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent animate-pulse">
            <span className="text-2xl text-accent-foreground">⏳</span>
          </div>
          <p className="text-[15px] font-medium text-foreground">Analyzing {filename}...</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Extracting frames & building index</p>
          <div className="mt-4 space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "60%" }} />
            </div>
            <DNASkeleton />
            <FramesSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[60%]">
          <VideoPlayer
            videoElementRef={videoElementRef}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          />

          <div className="mt-4 space-y-6">
            <VideoDNA
              retrievedBars={retrievedBars}
              currentBarIndex={activeBarIndex}
              duration={duration}
              onBarClick={handleBarClick}
            />

            <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {mockScenes.map((scene, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 rounded-badge border-l-[3px] border-primary bg-muted px-3 py-1.5 transition-colors hover:bg-accent"
                  >
                    <span className="text-[12px] font-medium text-foreground">{scene.label}</span>
                    <span className="ml-1.5 text-[11px] text-muted-foreground">· {scene.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: TOTAL_KEYFRAMES }).map((_, index) => (
                  <div
                    key={index}
                    className={`relative h-[66px] w-[100px] flex-shrink-0 overflow-hidden rounded-btn shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:h-[80px] md:w-[120px] ${
                      retrievedFrames.has(index)
                        ? "ring-2 ring-primary -translate-y-[3px]"
                        : activeFrameIndex === index
                          ? "ring-2 ring-ring/40"
                          : "ring-1 ring-border"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, hsl(${200 + index * 15}, 20%, ${40 + index * 5}%), hsl(${220 + index * 10}, 15%, ${55 + index * 3}%))`,
                    }}
                  >
                    <span className="absolute left-1.5 top-1 text-[10px] text-primary-foreground/70">
                      Scene {Math.ceil((index + 1) / 3)}
                    </span>
                    <span className="absolute bottom-1 left-1.5 rounded bg-foreground/60 px-1 font-mono text-[10px] text-primary-foreground">
                      0:{String(index * 2).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <NextSteps currentPage="/" />
          </div>
        </div>

        <AnalyzeChat onRetrieve={handleRetrieve} />
      </div>
    </div>
  );
}
