import React, { useCallback, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  onClear: () => void;
  preview: string | null;
}

export function ImageUpload({ onImageSelect, onClear, preview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative aspect-square rounded-3xl overflow-hidden group border-2 border-white/10">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={onClear}
              className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
            isDragging 
              ? "border-anime-pink bg-anime-pink/10 scale-[0.99]" 
              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
          )}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="p-4 rounded-2xl bg-white/5">
            <Upload className={cn("w-10 h-10 transition-colors", isDragging ? "text-anime-pink" : "text-white/40")} />
          </div>
          <div className="text-center px-6">
            <p className="font-display font-black text-xl uppercase italic tracking-tighter">Drag & Drop Photo</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">JPG, PNG or WEBP (Max 5MB)</p>
          </div>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleInput}
          />
        </div>
      )}
    </div>
  );
}
