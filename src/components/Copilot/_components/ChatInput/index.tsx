import { useRef, KeyboardEvent } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { MessageCopilotForm } from "@/types/api/copilot";

import useAutosizeTextArea from "@/utils/hooks/useAutoSizeTextArea";
import useAppSelector from "@/utils/hooks/useAppSelector";
import { localization } from "@/utils/functions/localization";

import { CopilotLogo, DisabledSendIcon, SendIcon } from "@/assets/images";

import { Textarea } from "@/components/ui/textarea";

import { selectLanguage } from "@/stores/languageStore/languageSlice";

type ChatInputProps = {
  copilotForm: UseFormReturn<MessageCopilotForm, undefined>;
  handleSubmit: (data: MessageCopilotForm) => Promise<void>;
  isLoading: boolean;
};

export default function ChatInput({
  copilotForm,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const language = useAppSelector(selectLanguage);

  // 92 = 4 rows
  const maxHeight = 92;
  const chatValue = copilotForm.watch("chat");

  useAutosizeTextArea(textAreaRef.current, chatValue, maxHeight);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      copilotForm.handleSubmit(handleSubmit)();
    }
  };

  return (
    <form onSubmit={copilotForm.handleSubmit(handleSubmit)}>
      <div className="w-[225px] lg:w-[255px] mx-auto relative mb-10 z-10">
        <div className="absolute left-4 rounded-full top-2 p-1.5 bg-white flex justify-self-center items-center shadow shadow-[black/.05]">
          <img src={CopilotLogo} alt="copilot" width={16} height={16} />
        </div>
        <Controller
          name="chat"
          control={copilotForm.control}
          render={({ field: { onChange, value } }) => (
            <Textarea
              rows={1}
              ref={textAreaRef}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              value={value}
              placeholder={localization("Ask Me Anything", language)}
              className={`bg-white rounded-3xl border-0 px-14 min-h-0 py-3.5 placeholder:font-semibold text-black resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-sm`}
            />
          )}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-4 bottom-2.5"
        >
          <img src={isLoading ? DisabledSendIcon : SendIcon} alt="send" />
        </button>
      </div>
    </form>
  );
}
