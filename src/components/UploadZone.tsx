import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File, base64: string, mimeType: string) => void;
  onError: (message: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function UploadZone({ onFileSelect, onError }: UploadZoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError('Unsupported format. Please upload a JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError('File exceeds 10MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64Parts = result.split(',');
        if (base64Parts.length === 2) {
          onFileSelect(file, base64Parts[1], file.type);
        } else {
          onError('Failed to parse image data.');
        }
      }
    };
    reader.onerror = () => {
      onError('Failed to read the file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ease-out group ${
        isHovered
          ? 'border-accent bg-surface/50 scale-[1.02]'
          : 'border-border bg-surface/20 hover:border-accent/50 hover:bg-surface/30'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full bg-surface transition-colors duration-300 ${isHovered ? 'text-accent' : 'text-mutedText group-hover:text-primaryText'}`}>
          <UploadCloud size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-display font-medium text-primaryText">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-mutedText">
            JPG, PNG, or WEBP (Max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
