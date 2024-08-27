import { AnAuthorized } from '@/assets/images';
import Datetime from '@/components/TopBar/_components/Datetime';

const MaintenanceCard = () => {
  return (
    <div className="flex h-full w-full flex-col px-3 py-3">
      <div className="ml-auto">
        {' '}
        <Datetime />
      </div>
      <div className="flex min-h-[80vh] flex-row flex-wrap items-center justify-center overflow-hidden">
        <div className="font-plus-jakarta-sans relative flex flex-col items-center justify-center">
          <img src={AnAuthorized} alt="copilot" width={300} height={300} />
          <p className="absolute top-[150px] text-center text-2xl uppercase">
            Maintenance underway
          </p>
          <p className="absolute bottom-[110px] text-center text-xs">
            {`The website is undergoing a scheduled downtime for essential improvements. (Estimated downtime: +24 Hours) 
Thank you for your understanding.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCard;
