export interface ProfilePicture {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  storage_url: string;
  public_url: string;
  is_active: boolean;
  is_primary: boolean;
  upload_status: 'pending' | 'uploading' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePictureUpload {
  file: File;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

export interface ProfilePictureUpdate {
  is_active?: boolean;
  is_primary?: boolean;
  upload_status?: ProfilePicture['upload_status'];
  error_message?: string;
}