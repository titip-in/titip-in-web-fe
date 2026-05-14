import api from '@/lib/api';
import { ApiResponse, UploadResponse } from '@/types/api';

/**
 * Upload a single image to POST /v1/upload
 * Returns the image_url string
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post<ApiResponse<UploadResponse>>('/v1/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data.image_url;
}
