import { useDispatch, useSelector } from "react-redux";

import { RapidsenseLogo } from "@/assets/images";

import { toggleCopilot } from "@/stores/copilotStore/toggleCopilotSlice";
import { AppDispatch, RootState } from "@/stores";

import ControlItem from "../ControlItem";
import useWindowDimensions from "@/utils/hooks/useWindowDimension";
import { useEffect } from "react";

export default function ControlList() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const { isCopilotOpen } = useSelector(({ toggleCopilotSlice }: RootState) => toggleCopilotSlice);

  const handleCopilotToggle = () => {
    dispatch(toggleCopilot());
  };

  useEffect(() => {
    if (isCopilotOpen) {
      handleCopilotToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div className="flex">
      <ControlItem onClick={handleCopilotToggle} className={isCopilotOpen ? "border-white" : ""}>
        <img src={RapidsenseLogo} alt="copilot" height={24} width={24} />
      </ControlItem>
    </div>
  );
}
