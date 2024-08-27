export type TFileMetadata = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  file_code: string;
  original_name: string;
  extension: string;
  file_size: number;
  company_id: number;
};
