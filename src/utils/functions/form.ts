import { ChangeEvent } from 'react';

export const objectToFormData = (
  obj: Record<
    string,
    string | number | File | object | null | undefined | boolean
  >,
): FormData => {
  const formData = new FormData();

  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && value instanceof File) {
        // Handle file uploads (e.g., images)
        formData.append(key, value);
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        // Handle regular fields (string or number)
        formData.append(key, String(value));
      } else {
        // Convert nested object to JSON and append it
        formData.append(key, JSON.stringify(value));
      }
    }
  }

  return formData;
};

interface ImageData {
  files: FileList;
  filesName: string;
  displayUrl: string;
}

export const getImageData = (
  event: ChangeEvent<HTMLInputElement>,
): ImageData => {
  const dataTransfer = new DataTransfer();

  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image),
  );

  const files = dataTransfer.files;
  const filesName = dataTransfer.files[0].name;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl, filesName };
};

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToBlobUrl = (base64: string): string => {
  try {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    return base64;
  }
};

export const base64ToFilesArray = (base64: string, fileName: string) => {
  try {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const file = new File([blob], fileName, { type: 'image/jpeg' });

    const dataTransfer = new DataTransfer();

    if (file) {
      dataTransfer.items.add(file);
    }

    const filesArray = Array.from(dataTransfer.files);
    return filesArray;
  } catch (error) {
    return base64;
  }
};
