import { useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";

const ShiftTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shiftParams = searchParams.get("shift");

  const handleClickViewParameter = (view: "1" | "2" | "3") => {
    searchParams.set("shift", view);
    setSearchParams(searchParams);
  };

  const ShiftButton = ({ shift }: { shift: "1" | "2" | "3" }) => (
    <div
      className={cn(
        "rounded-sm p-2 py-[1px]",
        shiftParams === shift ? "bg-rs-v2-dark-grey" : "bg-transparent",
        "cursor-pointer transition-all ease-in-out"
      )}
      onClick={() => handleClickViewParameter(shift)}>
      <span
        className={cn(
          shiftParams === shift ? "text-rs-v2-mint" : "text-rs-v2-light-grey",
          "whitespace-nowrap text-sm"
        )}>
        Shift {shift}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <ShiftButton shift="1" />
      <ShiftButton shift="2" />
      <ShiftButton shift="3" />
    </div>
  );
};

export default ShiftTab;
