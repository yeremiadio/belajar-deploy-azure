import { FC, useEffect, useState, useMemo } from 'react';
import { PolygonF } from '@react-google-maps/api';
import { IoTriangle } from 'react-icons/io5';

import {
  TEmployeeLocation,
  TEmployeeLocationDetail,
} from '@/types/api/employeeTracker';

import {
  DEFAULT_CENTER_GOOGLE_MAPS_POS,
  DEFAULT_GOOGLE_MAPS_POLYGON_RS_RED_OPTION,
} from '@/utils/constants/defaultValues/googleMapsDefaultValues';
import { generateMapDescription } from '@/utils/functions/tuningCopilot/mapDescription';

import { GoogleMaps } from '@/components/GoogleMaps';
import { PointMarker } from '@/components/GoogleMaps/PointMarker';

type Props = {
  data?: TEmployeeLocation;
  selectedEmployee?: TEmployeeLocationDetail;
  toggleSelectedEmployee: (employee: TEmployeeLocationDetail) => void;
};

const EmployeeLocation: FC<Props> = ({
  data,
  selectedEmployee,
  toggleSelectedEmployee,
}) => {
  const employees = useMemo(() => data?.employee ?? [], [data]);
  const restrictedAreas = useMemo(
    () => data?.restrictedCoordinates ?? [],
    [data],
  );

  const [currentFocus, setCurrentFocus] = useState({
    lat: employees[0]?.coordinates?.lat ?? 0,
    lng: employees[0]?.coordinates?.lng ?? 0,
  });

  const restrictedCoordinates = restrictedAreas?.map((area) => {
    return area.lat.map((lat, index) => ({
      lat: lat,
      lng: area.lng[index],
    }));
  });

  // const coordinates = data?.restrictedCoordinates?.[0]?.lat?.map(
  //   (lat, index) => ({
  //     lat: lat,
  //     lng: data.restrictedCoordinates[0].lng[index],
  //   }),
  // );

  const employeeMapData = employees?.map((item) => ({
    lattitude: item.coordinates?.lat.toString() ?? '',
    longtitude: item.coordinates?.lng.toString() ?? '',
  }));

  // const restrictedAreaMapData = restrictedAreas?.map((area) => {
  //   return area.lat.map((lat, index) => ({
  //     lattitude: lat.toString(),
  //     longtitude: area.lng[index].toString(),
  //   }));
  // });

  // const mapData = coordinates?.map((coord) => ({
  //   lattitude: coord.lat.toString(),
  //   longtitude: coord.lng.toString(),
  // }));

  const employeeLocationDescription = generateMapDescription({
    center: currentFocus,
    data: employeeMapData,
    getTooltipDescription: (item) => {
      return `Employee Location, Latitude: ${item.lattitude}, Longitude: ${item.longtitude}`;
    },
  });

  // const restrictedAreaDescription = generateMapDescription({
  //   center: currentFocus,
  //   data: restrictedAreaMapData,
  //   getTooltipDescription: (item) => {
  //     return `Restricted area, Location: Latitude: ${item.lattitude}, Longitude: ${item.longtitude}`;
  //   },
  // });

  const markers = employeeMapData?.map((item) => ({
    lat: parseFloat(item.lattitude),
    lng: parseFloat(item.longtitude),
  }));

  useEffect(() => {
    if (selectedEmployee) {
      setCurrentFocus({
        lat: selectedEmployee?.coordinates?.lat ?? 0,
        lng: selectedEmployee?.coordinates?.lng ?? 0,
      });
    }
  }, [selectedEmployee]);

  return (
    <div className="flex-1 rounded-md border-[1.5px] border-rs-v2-thunder-blue">
      <h1 className="hidden">Location Monitor Map</h1>
      <span className="hidden">{employeeLocationDescription}</span>
      {/* <span className="hidden">{restrictedAreaDescription}</span> */}

      <GoogleMaps
        mapContainerStyle={{ height: '100%' }}
        zoom={16}
        center={currentFocus}
        markers={markers}
      >
        {employees?.map((item, index) => {
          return (
            <PointMarker
              key={index}
              position={
                item?.coordinates
                  ? {
                      lat: item?.coordinates?.lat ?? 0,
                      lng: item?.coordinates?.lng ?? 0,
                    }
                  : DEFAULT_CENTER_GOOGLE_MAPS_POS
              }
              // isActive={selectedEmployee === item}
              forceShowDetail={selectedEmployee?.name === item?.name}
              useBigMarkerOnShowDetail={true}
              className={selectedEmployee === item ? 'z-10' : ''}
              additionalAction={() => toggleSelectedEmployee(item)}
            >
              <div className="relative mt-32 flex h-fit w-fit flex-col items-center rounded-lg bg-black/90 p-3 text-sm">
                <div>
                  <p className="mb-2 text-nowrap font-bold">{item.name}</p>
                  <div className="flex items-center gap-1 text-rs-neutral-chromium">
                    <p className="text-nowrap">{item.location}</p>
                  </div>
                </div>
                <IoTriangle className="absolute top-[-.8rem] text-black/90" />
              </div>
            </PointMarker>
          );
        })}

        {restrictedAreas?.map((_, index) => {
          return (
            <PolygonF
              key={index}
              path={restrictedCoordinates[index]}
              options={DEFAULT_GOOGLE_MAPS_POLYGON_RS_RED_OPTION}
            />
          );
        })}
        {/* <PolygonF
          path={coordinates}
          options={DEFAULT_GOOGLE_MAPS_POLYGON_RS_RED_OPTION}
        /> */}
      </GoogleMaps>
    </div>
  );
};

export default EmployeeLocation;
