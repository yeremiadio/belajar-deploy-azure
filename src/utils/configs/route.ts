export class ROUTES {
  static get base() {
    return `/` as const;
  }
  static get login() {
    return `/login` as const;
  }
  static get dashboard() {
    return `/dashboard` as const;
  }
  static get internalError() {
    return `/internal-system-error` as const;
  }
  static get energyMeter() {
    return `/energy-meter` as const;
  }
  static get energyMeterAdvanced() {
    return `/energy-meter-advanced` as const;
  }
  static energyMeterGateway(gatewayId: string): string {
    return `${this.energyMeter}/${gatewayId}` as const;
  }
  static energyMeterAdvancedGateway(gatewayId: string): string {
    return `${this.energyMeterAdvanced}/${gatewayId}` as const;
  }
  static get energyMeterDevices() {
    return `${this.energyMeter}/devices` as const;
  }
  static get energyMeterAdvancedDevices() {
    return `${this.energyMeterAdvanced}/devices` as const;
  }
  static energyMeterGatewayDevices(gatewayId: string) {
    return `${this.energyMeterGateway(gatewayId)}/devices` as const;
  }
  static energyMeterAdvancedGatewayDevices(gatewayId: string) {
    return `${this.energyMeterAdvancedGateway(gatewayId)}/devices` as const;
  }
  static get ewsFireForest() {
    return `/ews-forest-fire` as const;
  }
  static ewsFireForestGateway(gatewayId: string): string {
    return `${this.ewsFireForest}/${gatewayId}` as const;
  }
  static ewsFireForestDetail(id: string): string {
    return `${this.ewsFireForest}/detail/${id}` as const;
  }
  static ewsFireForestGatewayDetail(gatewayId: string, id: string): string {
    return `${this.ewsFireForestGateway(gatewayId)}/detail/${id}` as const;
  }
  static get ewsFlood() {
    return `/ews-flood` as const;
  }
  static ewsFloodGateway(gatewayId: string): string {
    return `${this.ewsFlood}/${gatewayId}` as const;
  }
  static ewsFloodDetail(id: string): string {
    return `${this.ewsFlood}/detail/${id}` as const;
  }
  static ewsFloodGatewayDetail(gatewayId: string, id: string): string {
    return `${this.ewsFloodGateway(gatewayId)}/detail/${id}` as const;
  }
  static get waterLevel() {
    return `/water-level` as const;
  }
  static waterLevelGateway(gatewayId: string): string {
    return `${this.waterLevel}/${gatewayId}` as const;
  }
  static waterLevelDetail(id: string): string {
    return `${this.waterLevel}/detail/${id}` as const;
  }
  static waterLevelGatewayDetail(gatewayId: string, id: string): string {
    return `${this.waterLevelGateway(gatewayId)}/detail/${id}` as const;
  }
  static waterQuality(): string {
    return `/water-quality` as const;
  }
  static get employeeTracker() {
    return `${this.asset}/employee-tracker` as const;
  }
  static employeeTrackerGateway(gatewayId: string): string {
    return `${this.employeeTracker}/${gatewayId}` as const;
  }
  static get employeeTrackerDetail() {
    return `${this.employeeTracker}/detail` as const;
  }
  static employeeTrackerGatewayDetail(gatewayId: string, id: string): string {
    return `${this.employeeTrackerGateway(gatewayId)}/detail/${id}` as const;
  }
  static get smartPole() {
    return `/smart-pole` as const;
  }
  static smartPoleGateway(gatewayId: string): string {
    return `${this.smartPole}/${gatewayId}` as const;
  }
  static smartPoleDetail(id: string): string {
    return `${this.smartPole}/detail/${id}` as const;
  }
  static smartPoleGatewayDetail(gatewayId: string, id: string): string {
    return `${this.smartPoleGateway(gatewayId)}/detail/${id}` as const;
  }
  static get envirobox() {
    return `/envirobox` as const;
  }
  static enviroboxGateway(gatewayId: string): string {
    return `${this.envirobox}/${gatewayId}` as const;
  }
  static enviroboxDetail(id: string): string {
    return `${this.envirobox}/detail/${id}` as const;
  }
  static enviroboxGatewayDetail(gatewayId: string, id: string): string {
    return `${this.enviroboxGateway(gatewayId)}/detail/${id}` as const;
  }
  static get management() {
    return `${this.base}management` as const;
  }
  static get managementAlert() {
    return `${this.management}/alert` as const;
  }
  static get managementDevice() {
    return `${this.management}/device` as const;
  }
  static get managementLocation() {
    return `${this.management}/location` as const;
  }
  static get managementGateway() {
    return `${this.management}/gateway` as const;
  }
  static get managementAccount() {
    return `${this.management}/account` as const;
  }
  static get managementCompany() {
    return `${this.management}/company` as const;
  }
  static get managementTag() {
    return `${this.management}/tag` as const;
  }
  static get managementInventory() {
    return `${this.management}/inventory` as const;
  }
  static get inventory() {
    return `/inventory` as const;
  }
  static get inventoryWorkOrder() {
    return `${this.inventory}/work-order` as const;
  }
  static get productionPlanning() {
    return `${this.inventory}/production-planning` as const;
  }
  static get inventoryInOutStock() {
    return `${this.inventory}/in-out-stock` as const;
  }
  static get managementMachine() {
    return `${this.management}/machine` as const;
  }
  static get managementRecipe() {
    return `${this.management}/recipe` as const;
  }
  static get overallEquipmentEffectiveness() {
    return `/oee` as const;
  }
  static get reservation() {
    return `/reservation` as const;
  }
  static get reservationVendor() {
    return `${this.yard}/reservation/vendor` as const;
  }
  static get reservationList() {
    return `${this.yard}/reservation/list` as const;
  }
  static reservationGateway(gatewayId: string): string {
    return `${this.reservation}/${gatewayId}` as const;
  }
  static get unitrace() {
    return `${this.yard}/unitrace` as const;
  }
  static unitraceGateway(gatewayId: string): string {
    return `${this.unitrace}/${gatewayId}` as const;
  }
  static get purchaseOrder() {
    return `${this.inventory}/purchase-order` as const;
  }
  static get purchaseOrderCreate() {
    return `${this.purchaseOrder}/create` as const;
  }
  static get purchaseOrderConfirmInventory() {
    return `${this.purchaseOrder}/confirm-inventory` as const;
  }
  static get mobileReservation() {
    return `/mobile-reservation` as const;
  }
  static mobileReservationDetail(reservationId: string): string {
    return `${this.mobileReservation}/${reservationId}`;
  }
  static mobileReservationConfirm(reservationId: string): string {
    return `${this.mobileReservation}/confirm/${reservationId}`;
  }
  static get asset() {
    return `/asset` as const;
  }
  static get yard() {
    return `/yard` as const;
  }
  static get waste() {
    return `/waste` as const;
  }
  static wasteMonitoringGateway(gatewayId: string): string {
    return `${this.waste}/${gatewayId}` as const;
  }
  static get machineMonitoring() {
    return `/machine-monitoring` as const;
  }
  static machineMonitoringGateway(gatewayId: string): string {
    return `${this.machineMonitoring}/${gatewayId}` as const;
  }
  static get machineMonitoringDetail() {
    return `${this.machineMonitoring}/detail`;
  }
  static machineMonitoringGatewayDetail(gatewayId: string, id: string): string {
    return `${this.machineMonitoringGateway(gatewayId)}/detail/${id}` as const;
  }
  static get report() {
    return `/report` as const;
  }
  static get profile() {
    return `/profile` as const;
  }
  static get resetPassword() {
    return `/reset-password` as const;
  }
  static get confirmResetPassword() {
    return `/reset-password/confirm` as const;
  }
  static get verifyEmail() {
    return `/verify-email` as const;
  }
}
