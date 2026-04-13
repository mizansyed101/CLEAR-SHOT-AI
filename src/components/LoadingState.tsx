import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 w-full max-w-2xl mx-auto">
      {/* Cinematic pulsing border simulation container */}
      <div className="relative processing-pulse rounded-sm">
        <div className="absolute inset-0 bg-accent/10 blur-[40px] rounded-full mix-blend-screen animate-pulse" />
        <div className="w-32 h-40 bg-surface rounded-sm flex items-center justify-center relative overflow-hidden border border-accent/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          <Loader2 className="w-8 h-8 text-accent animate-spin z-20" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-display text-primaryText tracking-wide">
          Rendering your Sony A1 edit…
        </h3>
        <p className="text-sm text-mutedText animate-pulse">
          Enhancing lighting, texture, and cinematic depth.
        </p>
      </div>
    </div>
  );
}
