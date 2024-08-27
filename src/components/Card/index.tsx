import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default function Card({
  children,
  className,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        `h-full w-full flex-shrink-0 overflow-auto rounded-xl border border-rs-v2-thunder-blue bg-rs-v2-navy-blue backdrop-blur-[15px]`,
        className
      )}>
      {children}
    </div>
  );
}
