import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default function ControlItem({
  children,
  onClick,
  className,
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-[60px] w-[60px] items-center justify-center rounded-lg border border-rs-v2-thunder-blue bg-rs-dark-card backdrop-blur-[3px] transition-all ease-in-out hover:border-white",
        className
      )}
      style={{
        filter: "drop-shadow(0px 4px 14.5px rgba(118, 133, 123, 0.19))",
      }}>
      {children}
    </button>
  );
}
