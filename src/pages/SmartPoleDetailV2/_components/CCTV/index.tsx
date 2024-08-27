import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { MdFullscreen, MdOutlinePause, MdVolumeUp } from 'react-icons/md';

import { SmartpoleVideo } from '@/assets/videos';

import { cn } from '@/lib/utils';

import Card from '@/components/Card';
import { TGatewayDevice } from '@/types/api/socket';

type Props = {
  deviceData?: TGatewayDevice;
};

const CCTV: FC<Props> = ({ deviceData }) => {
  /**
   * @todo integrate with real data
   */

  const isActive = deviceData?.status === 1;
  const deviceName = deviceData?.name;
  const deviceLocation = deviceData?.location?.name;
  const { formattedDate, formattedTime } = currentTime();

  return (
    <Card className="gap-3 border-none bg-transparent px-4 pt-5">
      <div className="box-border flex h-full flex-col gap-5">
        <h2 className="text-xl font-medium">
          CCTV:{' '}
          <span
            className={cn(
              'text-rs-v2-mint',
              isActive ? 'text-rs-v2-mint' : 'text-rs-v2-light-grey',
            )}
          >
            {isActive ? 'ON' : 'OFF'}
          </span>
        </h2>
        <div className="flex h-full items-center justify-center">
          <div className="group relative w-full overflow-hidden border">
            <div className="absolute top-3 flex w-full justify-between px-4 text-[.7vw]">
              <p className="cutive-mono">
                {deviceName} : {deviceLocation}
              </p>
              <p className="cutive-mono">
                {formattedDate} : {formattedTime}
              </p>
            </div>

            <video
              autoPlay
              muted
              loop
              src={SmartpoleVideo}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-[-50px] flex h-fit w-full flex-col gap-2 bg-gradient-to-t from-black/80 to-transparent pb-2 pt-5 transition-all duration-200 ease-in-out group-hover:bottom-0">
              <span className="h-[2px] w-full bg-rs-v2-red" />
              <div className="flex gap-2">
                <MdOutlinePause className="ms-2 text-2xl text-white" />
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <p className="text-sm">LIVE</p>
                </div>
                <div className="me-2 ms-auto flex items-center gap-2 text-rs-neutral-gray-gull/50">
                  <MdFullscreen className="me-2 ms-auto text-2xl" />
                  <MdVolumeUp className="text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Temporary for presentation
const currentTime = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const formattedDate = currentTime.format('DD/MM/YYYY');
  const formattedTime = currentTime.format('HH:mm:ss');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { formattedDate, formattedTime };
};

export default CCTV;
