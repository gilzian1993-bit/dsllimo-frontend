import { api } from "@/config/axios.config";
import API_ROUTES from "@/config/routes";

export interface UploadImageResponse {
  url: string;
  public_id: string;
}

export interface UploadImageResult {
  success: boolean;
  data: UploadImageResponse;
  message: string;
}

export const uploadImage = async (
  file: File,
  folder?: string
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  if (folder) {
    formData.append("folder", folder);
  }

  const response = await api.post<UploadImageResult>(
    API_ROUTES.UPLOAD_IMAGE,
    formData
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Upload failed");
  }

  return response.data.data;
};

