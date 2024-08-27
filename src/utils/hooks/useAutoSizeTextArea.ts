import { useEffect } from "react";

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
  maxHeightTextArea?: number
) => {
  useEffect(() => {
    if (textAreaRef) {

      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      textAreaRef.style.height = scrollHeight + "px";
      textAreaRef.style.maxHeight = maxHeightTextArea + "px";
    }
  }, [textAreaRef, value, maxHeightTextArea]);
};

export default useAutosizeTextArea;
