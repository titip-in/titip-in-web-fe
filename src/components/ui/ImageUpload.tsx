import React, { useRef, useState } from "react";
import { useUploadImage } from "@/hooks/useUpload";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: uploadImage, isPending } = useUploadImage();

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Harap unggah file gambar (JPG, PNG).");
      return;
    }
    
    uploadImage(file, {
      onSuccess: (url) => {
        onChange(url);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Gagal mengunggah gambar");
      }
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-subtle group">
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-charcoal text-sm font-semibold rounded-full hover:bg-cream"
            >
              Ganti
            </button>
            <button 
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-sage bg-sage/5' : 'border-charcoal-10 hover:border-charcoal-30 hover:bg-cream-dark/50'
          }`}
        >
          {isPending ? (
            <div className="text-charcoal-60 flex flex-col items-center">
              <svg className="animate-spin h-6 w-6 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Mengunggah...</span>
            </div>
          ) : (
            <div className="text-charcoal-60 flex flex-col items-center">
              <svg className="w-8 h-8 mb-2 text-charcoal-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span className="text-sm font-medium mb-1">Klik atau Drag & Drop gambar</span>
              <span className="text-xs text-charcoal-30">Format JPG atau PNG (Max 5MB)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
