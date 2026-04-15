'use client';

import { useState } from "react";
import UploadHero from "../../src/components/UploadHero";
import PreloadedBanner from "../../src/components/PreloadedBanner";
import NextSteps from "../../src/components/NextSteps";
import VideoPlayer from "../../src/components/VideoPlayer";
import { useVideo } from "@/contexts/VideoContext";
import { useToast } from "@/hooks/use-toast";

const mockKeyMoments = [
  { time: "0:00", desc: "Opening shot — stadium exterior, crowd arriving" },
  { time: "0:04", desc: "Teams emerge from the tunnel onto the pitch" },
  { time: "0:08", desc: "Match begins — fast-paced opening attack" },
  { time: "0:11", desc: "Goal scored — spectacular long-range strike" },
  { time: "0:14", desc: "Celebration — team gathers at corner flag" },
];

const summaries = {
  short: "A 14-second football clip capturing a stunning long-range goal and celebration.",
  medium: "This 14-second video captures a pivotal moment during a football match. The footage opens with an establishing shot of the stadium as fans fill the stands. Both teams emerge from the tunnel to roaring applause. The highlight is a remarkable long-range strike that sails past the goalkeeper into the top corner of the net. The video concludes with jubilant celebrations.",
  detailed: "This 14-second video captures a pivotal moment during a football match. The footage opens with an establishing shot of the stadium as fans fill the stands. Both teams emerge from the tunnel to roaring applause. The match kicks off with an immediate attacking play down the left wing. The highlight is a remarkable long-range strike that sails past the goalkeeper into the top corner of the net. The video concludes with jubilant celebrations as teammates converge at the corner flag. The cinematography captures both the technical brilliance of the strike and the raw emotion of the celebration.",
};

export default function SummarizePage() {
  const { hasVideo, setVideo, filename } = useVideo();
  const { toast } = useToast();
  const [showBanner, setShowBanner] = useState(true);
  const [summarized, setSummarized] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "detailed">("medium");

  const handleUpload = (file: File) => setVideo(file);

  const startSummarize = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSummarized(true);
      toast({ title: "Summary generated", description: `${summaryLength} summary ready` });
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaries[summaryLength]);
    toast({ title: "Copied to clipboard", description: "Summary text copied" });
  };

  const handleDownloadPdf = () => {
    const text = `Video Summary (${summaryLength})\n\n${summaries[summaryLength]}\n\nKey Moments:\n${mockKeyMoments.map(m => `[${m.time}] ${m.desc}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "video-summary.txt saved" });
  };

  if (!hasVideo) {
    return (
      <UploadHero
        heading="Summarize your video"
        subtitle="Get an AI-written summary with key moments and highlights"
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

      {!summarized ? (
        <div className="text-center animate-slide-up mt-6 space-y-4">
          <div className="flex justify-center gap-2">
            {(["short", "medium", "detailed"] as const).map((len) => (
              <button
                key={len}
                onClick={() => setSummaryLength(len)}
                className={`text-[12px] px-3 py-1.5 rounded-pill border transition-all min-h-[36px] capitalize ${
                  summaryLength === len
                    ? "bg-amber-100 border-amber-300 text-amber-700"
                    : "border-border text-muted-foreground hover:border-amber-200"
                }`}
              >
                {len}
              </button>
            ))}
          </div>
          <button
            onClick={startSummarize}
            disabled={processing}
            className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[14px] font-medium px-8 py-3 rounded-btn transition-all disabled:opacity-50 min-h-[48px] hover:scale-[1.02] active:scale-[0.98]"
          >
            {processing ? "Generating summary…" : "Generate Summary"}
          </button>
        </div>
      ) : (
        <div className="animate-slide-up space-y-6 mt-6">
          <div className="flex gap-2">
            {(["short", "medium", "detailed"] as const).map((len) => (
              <button
                key={len}
                onClick={() => setSummaryLength(len)}
                className={`text-[12px] px-3 py-1.5 rounded-pill border transition-all capitalize ${
                  summaryLength === len
                    ? "bg-amber-100 border-amber-300 text-amber-700"
                    : "border-border text-muted-foreground hover:border-amber-200"
                }`}
              >
                {len}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-card p-4 md:p-6">
            <h2 className="text-[15px] font-semibold mb-3">Video Summary</h2>
            <p className="text-[13px] md:text-[14px] text-foreground leading-relaxed">
              {summaries[summaryLength]}
            </p>
          </div>

          <div className="bg-card border border-border rounded-card p-4 md:p-6">
            <h2 className="text-[15px] font-semibold mb-4">Key Moments</h2>
            <div className="space-y-3">
              {mockKeyMoments.map((m, i) => (
                <div key={i} className="flex gap-3 md:gap-4 items-start group cursor-pointer">
                  <div className="w-1 h-full bg-amber-300 rounded-full shrink-0 self-stretch min-h-[20px] group-hover:bg-amber-500 transition-colors" />
                  <span className="font-mono text-[12px] text-amber-600 shrink-0 pt-0.5">{m.time}</span>
                  <p className="text-[13px] text-foreground group-hover:text-amber-700 transition-colors">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleCopy} className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Copy summary
            </button>
            <button onClick={handleDownloadPdf} className="border border-border text-foreground bg-card hover:bg-muted text-[13px] font-medium px-4 py-2 rounded-btn transition-all min-h-[44px]">
              Download as TXT
            </button>
          </div>

          <NextSteps currentPage="/summarize" />
        </div>
      )}
    </div>
  );
}
