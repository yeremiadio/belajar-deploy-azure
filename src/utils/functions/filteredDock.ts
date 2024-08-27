import { TReservationObject } from '@/types/api/reservation';
import { TYard, EYardActivityStatusEnum } from '@/types/api/yard';

export const filteredByActivity = (
  activity: string,
  yardData?: TReservationObject[],
) => {
  if (!yardData) return [];
  return yardData.filter((yard) => yard.status === activity);
};

export const filteredDock = (
  data: TReservationObject[],
  dockSize: number = 10,
): { [key: string]: TReservationObject[] } => {
  const constants: { [key: string]: TReservationObject[] } = {};
  data.forEach((yard) => {
    if (yard.status === EYardActivityStatusEnum.DOCKING && yard.dockNumber) {
      const index = parseInt(yard.dockNumber.slice(-2), 10) - 1; // Extract the index from dockNo
      const letter = yard.dockNumber.charAt(0);
      if (!constants[letter]) {
        constants[letter] = Array(dockSize).fill(null); // Initialize array with 10 elements
      }
      constants[letter][index] = yard; // Assign yard object to the corresponding index
    }
  });
  return constants;
};

export const transformDocksData = (docksData?: TYard) => {
  if (!docksData) return [];

  const transformedData: {
    [key: string]: {
      code: number;
      name: string;
      isRestricted: boolean;
    }[];
  } = {};

  docksData.docks.forEach((dock) => {
    const { code: dockCode, name, location } = dock;
    if (!location?.name) return;

    if (!transformedData[location?.name]) {
      transformedData[location?.name] = [];
    }

    transformedData[location?.name].push({
      code: dockCode,
      name: name ?? '',
      isRestricted: false,
    });
  });

  docksData.restrictedDocks.forEach((restrictedDock) => {
    const { code: dockCode, location } = restrictedDock;
    if (!location?.name) return;

    // change isRestricred to true
    const dock = transformedData[location?.name].find(
      (dock) => dock.code === dockCode,
    );
    if (dock) {
      dock.isRestricted = true;
    }
  });

  const docksArray = Object.keys(transformedData)
    .map((warehouseName) => ({
      warehouseName,
      docks: transformedData[warehouseName],
    }))
    .sort((a, b) => a.warehouseName.localeCompare(b.warehouseName));

  return docksArray;
};
