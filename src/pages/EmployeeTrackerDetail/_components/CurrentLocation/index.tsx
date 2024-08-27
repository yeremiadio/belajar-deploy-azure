import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';
import { useGetEmpCurrentLocationQuery } from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { DEFAULT_CENTER_GOOGLE_MAPS_POS } from '@/utils/constants/defaultValues/googleMapsDefaultValues';
import { localization } from '@/utils/functions/localization';
import { generateMapDescription } from '@/utils/functions/tuningCopilot/mapDescription';
import useAppSelector from '@/utils/hooks/useAppSelector';

type CurrentLocationProps = {
  id?: string | null;
};

const CurrentLocation: FC<CurrentLocationProps> = ({ id }) => {
  const language = useAppSelector(selectLanguage);

  const { gatewayId } = useParams<'gatewayId'>();

  const { data } = useGetEmpCurrentLocationQuery({
    id: id || '1',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  const mapData = {
    lattitude: data?.lat?.toString() || '',
    longtitude: data?.lng?.toString() || '',
  };

  const mapDescription = generateMapDescription({
    center: DEFAULT_CENTER_GOOGLE_MAPS_POS,
    data: [mapData],
    getTooltipDescription: (item) => {
      return `Current employee position, Location: Latitude: ${item.lattitude}, Longitude: ${item.longtitude}`;
    },
  });

  return (
    <div className="flex h-full w-full flex-col gap-4 p-5">
      <h1 className="h-fit text-start text-xl">
        {localization('Current Location', language)}
      </h1>
      <div className="flex-1">
        <span className="hidden">{mapDescription}</span>
        <GoogleMaps
          mapContainerStyle={{
            height: '100%',
            borderRadius: '0.5rem',
            border: '1px solid #354358',
          }}
          zoom={16}
          center={data || DEFAULT_CENTER_GOOGLE_MAPS_POS}
        >
          {data && (
            <PointMarker
              useBigMarker={true}
              position={{
                lat: data.lat,
                lng: data.lng,
              }}
            />
          )}
        </GoogleMaps>
      </div>
    </div>
  );
};

export default CurrentLocation;
