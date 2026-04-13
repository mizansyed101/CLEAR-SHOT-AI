import React from 'react';
import { Download, RefreshCcw } from 'lucide-react';

interface DownloadButtonProps {
  base64: string;
  onReset: () => void;
}

export default function DownloadButton({ base64, onReset }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    // Ensure we have the proper data URI syntax if it's missing
    link.href = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
    link.download = 'clearshot-enhanced.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-4xl mx-auto">
      <button
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 px-8 py-4 bg-accent text-background font-medium rounded-sm hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background flex-1 sm:flex-none"
      >
        <Download size={20} />
        Download Enhanced
      </button>
      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 px-6 py-4 bg-surface text-primaryText font-medium rounded-sm hover:bg-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-surface focus:ring-offset-2 focus:ring-offset-background flex-1 sm:flex-none"
      >
        <RefreshCcw size={20} />
        Enhance Another
      </button>
    </div>
  );
}
