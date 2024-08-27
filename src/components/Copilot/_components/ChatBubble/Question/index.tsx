import { cn } from "@/lib/utils";

type Props = {
  text: string;
};

export default function Question({
  text,
  className,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-rs-baltic-blue lg:text-base text-sm rounded-xl py-3 self-end mx-4 px-4 lg:max-w-[220px] break-words",
        className
      )}
      {...rest}
    >
      {text}
    </div>
  );
}
