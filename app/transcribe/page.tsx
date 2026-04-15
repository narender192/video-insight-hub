'use client';

import { useState } from "react";
import { Search } from "lucide-react";
import UploadHero from "../../src/components/UploadHero";
import PreloadedBanner from "../../src/components/PreloadedBanner";
import NextSteps from "../../src/components/NextSteps";
import VideoPlayer from "../../src/components/VideoPlayer";
import { useVideo } from "@/contexts/VideoContext";
import { useToast } from "@/hooks/use-toast";

const mockTranscript = [
  { time: "0:00", text: "Welcome to today's match coverage. We're here at the stadium with thousands of fans eagerly waiting for kickoff." },
  { time: "0:04", text: "The teams are walking out onto the pitch now. You can feel the energy in the crowd, it's absolutely electric." },
  { time: "0:08", text: "And we're underway! The ball is played forward quickly. There's a great run down the left wing." },
  { time: "0:11", text: "What a strike! The ball flies past the goalkeeper and into the top corner. Incredible technique on display." },
  { time: "0:14", text: "The celebrations are wild. The scorer runs to the corner flag as teammates pile on. What a moment." },
];

export default function TranscribePage() {
  const { hasVideo, setVideo, filename } = useVideo();
  const { toast } = useToast();
  const [showBanner, setShowBanner] = useState(true);
  const [transcribed, setTranscribed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpload = (file: File) => setVideo(file);

  const startTranscribe = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setTranscribed(true);
      toast({ title: "Transcription complete", description: "5 segments transcribed with timestamps" });
    }, 2500);
  };

  const handleCopy = () => {
    const text = mockTranscript.map(l => `[${l.time}] ${l.text}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Full transcript copied" });
  };

  const handleDownloadTxt = () => {
    const text = mockTranscript.map(l => `[${l.time}] ${l.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "transcript.txt saved" });
  };

  const handleDownloadSrt = () => {
    const srt = mockTranscript.map((l, i) => {
      const start = l.time.replace(":", "00:0") + ",000";
      const nextTime = mockTranscript[i + 1]?.time || "0:16";
      const end = nextTime.replace(":", "00:0") + ",000";
      return `${i + 1}\n${start} --> ${end}\n${l.text}\n`;
    }).join("\n");
    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.srt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "transcript.srt saved" });
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Transcribe your video"
        subtitle="Convert speech to text with timestamps using Whisper AI"
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

      {!transcribed ? (
        <div className="text-center animate-slide-up mt-6">
          <button
            onClick={startTranscribe}
            disabled={processing}
            className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[14px] font-medium px-8 py-3 rounded-btn transition-all disabled:opacity-50 min-h-[48px] hover:scale-[1.02] active:scale-[0.98]"
          >
            {processing ? "Transcribing with Whisper AI…" : "Start Transcription"}
          </button>
        </div>
      ) : (
        <div className="animate-slide-up mt-6">
          <div className="flex items-center gap-2 border border-border rounded-pill px-3 py-1.5 mb-6 focus-within:border-amber-400 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transcript…"
              className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-muted-foreground min-h-[36px]"
            />
          </div>

          <div className="bg-card border border-border rounded-card p-4 md:p-6 space-y-4 mb-6">
            {mockTranscript.map((line, i) => {
              const highlight = searchTerm && line.text.toLowerCase().includes(searchTerm.toLowerCase());
              const highlightedText = searchTerm
                ? line.text.replace(
                    new RegExp(`(${searchTerm})`, "gi"),
                    '<mark class="bg-amber-200 rounded px-0.5">$1</mark>'
                  )
                : line.text;

              return (
                <div key={i} className={`flex gap-3 md:gap-4 transition-colors ${highlight ? "bg-amber-50 -mx-2 px-2 py-1 rounded-badge" : ""}`}>
                  <span className="font-mono text-[12px] text-amber-600 shrink-0 pt-0.5">[{line.time}]</span>
                  <p className="text-[13px] md:text-[14px] text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightedText }} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mb-2">
            <button onClick={handleCopy} className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Copy transcript
            </button>
            <button onClick={handleDownloadTxt} className="border border-border text-foreground bg-card hover:bg-muted text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Download as TXT
            </button>
            <button onClick={handleDownloadSrt} className="border border-border text-foreground bg-card hover:bg-muted text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Download as SRT
            </button>
          </div>

          <NextSteps currentPage="/transcribe" />
        </div>
      )}
    </div>
  );
}
