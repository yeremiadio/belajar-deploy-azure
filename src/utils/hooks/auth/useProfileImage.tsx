import { useEffect, useState } from "react";

import { showProfileImage } from "@/api/userApi";

import { convertAxiosResponseImageToString } from "@/utils/functions/convertAxiosImageResponseToString";

const useProfileImage = (): string => {
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    const getImageData = async () => {
      try {
        const res = await showProfileImage();
        const base64Res = convertAxiosResponseImageToString(res);
        setImage(base64Res);
      } catch (error) {
        console.log(error);
      }
    };
    getImageData();
  }, [image]);

  return image;
};

export default useProfileImage;
