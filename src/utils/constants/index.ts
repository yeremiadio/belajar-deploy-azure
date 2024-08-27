// update these values accordingly
export enum GWThemeEnum {
  'energymeter' = 'energymeter',
  'energymeteradvanced' = 'energymeteradvanced',
  'aquasense' = 'aquasense',
  'flood' = 'flood',
  'forestfire' = 'forestfire',
  'employeetracker' = 'employeetracker',
  'smartpole' = 'smartpole',
  'envirobox' = 'envirobox',
  'yard' = 'yard',
  'reservation' = 'reservation',
  'purchaseorder' = 'purchaseorder',
  'inventrace' = 'inventrace',
  'oee' = 'oee',
  'machinemonitoring' = 'machinemonitoring',
  'wastemonitoring' = 'wastemonitoring',
}

export enum MgmtPageEnum {
  'reservation' = 'reservation',
  'account' = 'account',
  'location' = 'location',
  'device' = 'device',
  'alert' = 'alert',
  'tag' = 'tag',
  'employee' = 'employee',
  'machine' = 'machine',
  'inventory' = 'inventory',
  'recipe' = 'recipe',
}

export enum ProductionPageEnum {
  'productionplaning' = 'productionplaning',
  'workorder' = 'workorder',
  'stock' = 'stock',
}

export const smartFactory = [
  'energymeter',
  'energymeteradvanced',
  'asset',
  'reservation',
  'inventory',
  'wastemonitoring',
  'machinemonitoring',
];

export const environmental = [
  'envirobox',
  'aquasense',
  'smartpole',
  'flood',
  'forestfire',
];
