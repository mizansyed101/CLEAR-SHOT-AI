"use client";

import React, { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import LoadingState from '@/components/LoadingState';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import DownloadButton from '@/components/DownloadButton';
import { RefreshCcw } from 'lucide-react';

type AppState = 'idle' | 'preview' | 'processing' | 'complete' | 'error';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [originalBase64, setOriginalBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [enhancedBase64, setEnhancedBase64] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (file: File, base64: string, mime: string) => {
    setOriginalBase64(base64);
    setMimeType(mime);
    const objectUrl = URL.createObjectURL(file);
    setOriginalPreviewUrl(objectUrl);
    setAppState('preview');
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
    setAppState('error');
  };

  const enhanceImage = async () => {
    if (!originalBase64 || !mimeType) return;
    
    setAppState('processing');
    
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: originalBase64, mimeType })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to enhance image');
      }
      
      setEnhancedBase64(data.enhancedBase64);
      setAppState('complete');
    } catch (err: unknown) {
      if (err instanceof Error) {
        handleError(err.message || 'An unexpected error occurred.');
      } else {
        handleError('An unexpected error occurred.');
      }
    }
  };

  const resetState = () => {
    setAppState('idle');
    if (originalPreviewUrl) {
      URL.revokeObjectURL(originalPreviewUrl);
    }
    setOriginalPreviewUrl(null);
    setOriginalBase64(null);
    setMimeType(null);
    setEnhancedBase64(null);
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen flex flex-col pt-12 pb-24 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col">
        {/* Header Section */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium text-primaryText tracking-tight">
            ClearShot AI
          </h1>
          <p className="text-lg sm:text-xl text-mutedText tracking-wide font-light">
            Every photo, rendered like a professional shot it.
          </p>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-grow flex flex-col items-center justify-center w-full animate-fade-in">
          
          {appState === 'idle' && (
            <UploadZone onFileSelect={handleFileSelect} onError={handleError} />
          )}

          {appState === 'preview' && originalPreviewUrl && (
            <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl mx-auto">
              <div className="rounded-sm overflow-hidden border border-border bg-surface p-2 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={originalPreviewUrl} 
                  alt="Original Preview" 
                  className="max-h-[60vh] object-contain rounded-sm"
                />
              </div>
              <button
                onClick={enhanceImage}
                className="px-10 py-4 bg-accent text-background font-medium text-lg rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-transform focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              >
                Enhance Photo
              </button>
            </div>
          )}

          {appState === 'processing' && (
            <LoadingState />
          )}

          {appState === 'complete' && originalPreviewUrl && enhancedBase64 && (
            <div className="w-full flex flex-col animate-fade-in fade-in-up">
              <BeforeAfterSlider 
                originalSrc={originalPreviewUrl} 
                enhancedSrc={`data:image/jpeg;base64,${enhancedBase64}`} 
              />
              <DownloadButton 
                base64={enhancedBase64} 
                onReset={resetState} 
              />
            </div>
          )}

          {appState === 'error' && (
            <div className="flex flex-col items-center justify-center p-12 border border-error/20 bg-error/5 rounded-sm w-full max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center text-error">
                {/* Simulated alert icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-display text-primaryText">Enhancement Failed</h3>
                <p className="text-error">{errorMessage}</p>
              </div>
              <button
                onClick={resetState}
                className="flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 text-primaryText font-medium rounded-sm transition-colors"
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-mutedText/60 tracking-wider">
        Powered by Google Gemini &middot; ClearShot AI
      </footer>
    </main>
  );
}
