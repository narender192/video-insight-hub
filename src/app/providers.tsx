'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { VideoProvider } from "@/contexts/VideoContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <VideoProvider>
          <Toaster />
          <SonnerToaster />
          {children}
        </VideoProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
