import React, { useRef, useState } from "react";
import { useUploadImage } from "@/hooks/useUpload";
import { toast } from "sonner";
import { X, Plus, Image as ImageIcon, Loader2 } from "lucide-react";

interface MultiImageUploadProps {
  value: string[]; // Array of image URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 5,
  className = "" 
}: MultiImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: uploadImage, isPending } = useUploadImage();

  const handleFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    
    if (value.length + fileList.length > maxImages) {
      toast.error(`Maksimal ${maxImages} foto.`);
      return;
    }

    fileList.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} bukan gambar.`);
        return;
      }

      uploadImage(file, {
        onSuccess: (url) => {
          onChange([...value, url]);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || `Gagal mengunggah ${file.name}`);
        }
      });
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Previews */}
        {value.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-subtle bg-cream-dark animate-in fade-in zoom-in duration-300">
            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {index === 0 && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-sage text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Utama
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {value.length < maxImages && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'border-sage bg-sage/5 scale-[0.98]' 
                : 'border-charcoal-10 hover:border-charcoal-30 hover:bg-cream-dark/50'
            }`}
          >
            {isPending ? (
              <div className="text-charcoal-60 flex flex-col items-center">
                <Loader2 className="animate-spin h-6 w-6 mb-2 text-sage" />
                <span className="text-[10px] font-medium uppercase tracking-widest">Mengunggah...</span>
              </div>
            ) : (
              <div className="text-charcoal-40 flex flex-col items-center group">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 border border-subtle">
                  <Plus size={20} className="text-charcoal-60" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Tambah Foto</span>
                <span className="text-[9px] text-charcoal-20 mt-1">{value.length}/{maxImages}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <input 
        type="file" 
        multiple
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
      />
      
      {value.length === 0 && !isPending && (
        <div className="py-8 px-4 border border-dashed border-subtle rounded-xl flex flex-col items-center justify-center text-center bg-cream-dark/30">
          <ImageIcon className="w-8 h-8 text-charcoal-10 mb-2" />
          <p className="text-xs text-charcoal-40">Belum ada foto yang diunggah.<br/>Foto pertama akan menjadi foto utama di katalog.</p>
        </div>
      )}
    </div>
  );
}
