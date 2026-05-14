import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/lib/uploadApi';

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  });
}
