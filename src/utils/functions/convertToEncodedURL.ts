export const convertToEncodedURL = (obj: { [key: string]: any }) => {
    const formBody = [];
    for (const property in obj) {
      if (typeof obj[property] === "undefined") continue;
      const key = encodeURIComponent(property);
      const value = encodeURIComponent(obj[property]);
      formBody.push(`${key}=${value}`);
    }
    return formBody.join("&");
  }
  