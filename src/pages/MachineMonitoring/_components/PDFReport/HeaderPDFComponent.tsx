import { FC } from 'react';
import { HeaderImage, RapidsenseIcon } from '@/assets/images';
import { cn } from '@/lib/utils';

type Props = {
  machineName: string | undefined;
  date: string;
  className?: string;
};

const Header: FC<Props> = ({ machineName, date , className}) => {
  return (
    <div >
      <div className={cn("flex flex-row justify-between items-center p-5", className)}>
        <div className="flex flex-row justify-start items-center">
          <img src={RapidsenseIcon} alt="copilot" sizes="120px" />
        </div>
        <div className="flex justify-end items-center">
          <img src={HeaderImage} alt="copilot" sizes="120px" />
        </div>
      </div>
      <div className="flex mx-5 mt-[-20px] border-b-[1px] border-b-rs-divider-gray font-bold text-black">
        <div className="flex flex-row justify-between items-center mb-5 w-full">
          <div className="flex flex-row justify-start items-center">
            <p className="text-rs-v2-black-text-button">{machineName}</p>
          </div>
          <div className="flex justify-end items-center text-rs-v2-space">
            <p>{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
