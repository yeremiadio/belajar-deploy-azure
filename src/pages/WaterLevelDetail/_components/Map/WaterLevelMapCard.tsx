import { useMemo } from 'react';

import Card from '@/components/Card';

import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';

import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';

type Props = {
  data: IDeviceLocationWaterLevelObj | undefined;
};

const WaterLevelMapCard = ({ data }: Props) => {
  const deviceData = data?.device_summary;
  const currentCoordinate = {
    lat: deviceData?.location.coordinate.lat ?? 0,
    lng: deviceData?.location.coordinate.lng ?? 0,
  };
  const markers = useMemo(
    () => (currentCoordinate ? [currentCoordinate] : []),
    [currentCoordinate],
  );

  return (
    <Card className="overflow-y-hidden border-none bg-transparent px-4 pb-4 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium">Map Position</h2>
      </div>
      <GoogleMaps
        zoom={15}
        markers={markers}
        center={currentCoordinate}
        enableSmallZoomCtrl={true}
      >
        <PointMarker
          position={currentCoordinate}
          isOverThreshold={deviceData?.alert?.alert?.threatlevel === 2}
          isWarning={deviceData?.alert?.alert?.threatlevel === 1}
          forceShowDetail={false}
          useBigMarkerOnShowDetail={true}
        />
      </GoogleMaps>
    </Card>
  );
};

export default WaterLevelMapCard;
