import { AxiosResponse } from "axios";

/**
 * @description function for download file.csv with Bearer token
 * @param response
 * @param name_csv
 * @returns file.csv
 */
export const downloadCSVWithBearerToken = (
  response: AxiosResponse<string>,
  name_csv?: string,
) => {
  // Check if the response content-type is 'text/csv'
  const contentType = response.headers["content-type"];
  if (contentType && contentType.toLowerCase().includes("text/csv")) {
    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "text/csv" });

    // Create a link element
    const link = document.createElement("a");

    if (!!name_csv) {
      link.download = name_csv;
    }

    // Create a URL for the Blob and set it as the link's href
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  } else {
    // Handle the case when the response is not a CSV
    console.error("Invalid content type. Expected text/csv.");
  }
};
