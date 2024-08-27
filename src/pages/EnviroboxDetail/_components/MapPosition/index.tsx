import { FC, useEffect, useState } from 'react';

import Card from '@/components/Card';
import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';

import { TGatewayDevice } from '@/types/api/socket';

import { DEFAULT_CENTER_GOOGLE_MAPS_POS } from '@/utils/constants/defaultValues/googleMapsDefaultValues';

type Props = {
  deviceData?: TGatewayDevice;
};

const MapPosition: FC<Props> = ({ deviceData }) => {
  const [centerMaps, setCenterMaps] = useState({
    ...DEFAULT_CENTER_GOOGLE_MAPS_POS,
  });

  useEffect(() => {
    if (
      !deviceData?.location?.coordinate?.lat ||
      !deviceData?.location?.coordinate?.lng
    )
      return;

    setCenterMaps({
      lat: deviceData.location.coordinate.lat,
      lng: deviceData.location.coordinate.lng,
    });
  }, [deviceData]);

  return (
    <Card className="border-none bg-transparent px-4 pt-5">
      <div className="flex h-full flex-col">
        <h2 className="mb-5 text-xl font-medium">Map Position</h2>
        <div className="inline-block h-full w-full overflow-clip rounded-2xl">
          <GoogleMaps enableSmallZoomCtrl zoom={10} center={centerMaps}>
            {deviceData && (
              <PointMarker
                useBigMarker
                position={{
                  lat: deviceData?.location?.coordinate?.lat,
                  lng: deviceData?.location?.coordinate?.lng,
                }}
                isOverThreshold={deviceData.alert_status === 'CRITICAL'}
                isWarning={deviceData?.alert_status === 'WARNING'}
                isActive={deviceData?.status === 1}
                isConfirmedAlert={
                  deviceData?.userConfirmed &&
                  deviceData?.userConfirmed?.length > 0
                }
              />
            )}
          </GoogleMaps>
        </div>
      </div>
    </Card>
  );
};

export default MapPosition;
