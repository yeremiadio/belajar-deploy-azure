import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { FC, useRef } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import SolidCard from '@/pages/Waste/_components/WasteCard/SolidCard';
import LiquidCard from '@/pages/Waste/_components/WasteCard/LiquidCard';
import AirMonitoringCard from '@/pages/Waste/_components/WasteCard/AirMonitoringCard';


type Props = {
};

const WasteCardList: FC<Props> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

 
  return (
    <OverlayScrollbarsComponent
      className="w-full h-full"
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' } }}
      defer
    >
      <div ref={containerRef}>
          <ResponsiveMasonry 
            columnsCountBreakPoints={{
              350: 1,
              680: 1,
              750: 2,
              1100: 3,
              1400: 3,
              1800: 3,
            }}
          >
            <Masonry gutter="20px" className="pr-4">
            <SolidCard/>
            <LiquidCard/>
            <AirMonitoringCard/>
            </Masonry>
          </ResponsiveMasonry>
      </div>
    </OverlayScrollbarsComponent>
  );
};

export default WasteCardList;
