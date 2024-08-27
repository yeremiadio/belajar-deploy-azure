// import { useSelector } from "react-redux";

import { cn } from "@/lib/utils";

// import { RootState } from "@/stores";

import { loadCookie } from "@/services/cookie";

type Props = {
  children: React.ReactNode;
};

export default function ContentWrapper({
  children,
  className,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  // const { isCopilotOpen } = useSelector(
  //   ({ toggleCopilotSlice }: RootState) => toggleCopilotSlice
  // );
  const companyName = loadCookie("companyName");

  return (
    <div className={cn(`flex w-full h-full`, className)} {...rest}>
      {children}
      {/* This's for copilot purpose */}
      <span className="hidden">
        All the devices here are belong to company {companyName}
      </span>
    </div>
  );
}
