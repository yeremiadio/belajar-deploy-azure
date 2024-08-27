import { CopilotLogo, ErrorIcon } from "@/assets/images";

import { cn } from "@/lib/utils";

type Props = {
  text: string;
  errorChat?: boolean;
};

export default function Answer({
  text,
  className,
  errorChat,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex gap-2.5 items-start mx-6 relative">
      <img src={CopilotLogo} alt="copilot" width={24} height={24} />
      <div
        className={cn(
          "bg-rs-v2-silver rounded-xl lg:text-base text-sm py-3 text-rs-v2-charcoal px-4 lg:max-w-[210px] break-words",
          className
        )}
        {...rest}
      >
        {text === "..." ? (
          <div className="dot-typing">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="dot inline-block w-[2px] h-[2px] bg-rs-v2-charcoal rounded-full"
              />
            ))}
          </div>
        ) : (
          text
        )}
      </div>
      {errorChat && (
        <img
          src={ErrorIcon}
          alt="error message copilot"
          className="absolute bottom-0 left-[59px]"
          width={15}
          height={15}
        />
      )}
    </div>
  );
}
