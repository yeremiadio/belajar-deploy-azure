import { IoMdRefresh } from "react-icons/io";

import { CopilotLogo } from "@/assets/images";

type Props = {
  handleReset: () => void;
};

export default function Header({ handleReset }: Props) {
  return (
    <div className="flex justify-between border-b border-rs-v2-thunder-blue items-center py-5 px-6">
      <div className="flex items-center gap-4">
        <img src={CopilotLogo} alt="copilot" width={24} height={24} />
        <p className="font-bold text-rs-baltic-blue">Copilot</p>
      </div>
      <button onClick={handleReset} className="hover:text-white/80">
        <IoMdRefresh className="text-2xl" />
      </button>
    </div>
  );
}
