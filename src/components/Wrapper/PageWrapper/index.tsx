import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

export default function PageWrapper({
  children,
  className,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-full w-full flex-col", className)} {...rest}>
      {children}
    </div>
  );
}
