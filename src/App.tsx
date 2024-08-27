import '@/App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainLayout from '@/components/Layout/MainLayout';
import MobileLayout from '@/components/Layout/MobileLayout';
import Redirector from '@/components/Layout/Redirector';
import { Toaster } from '@/components/ui/toaster';
import DashboardPage from '@/pages/Dashboard';
import DevicesPage from '@/pages/Devices/DevicesPage';
import EmployeeTrackerPage from '@/pages/EmployeeTracker';
import EmployeeTrackerDetailPage from '@/pages/EmployeeTrackerDetail';
import EnergyMeterPage from '@/pages/EnergyMeter';
import EnviroboxPage from '@/pages/Envirobox';
import EnviroboxDetailPage from '@/pages/EnviroboxDetail';
import ErrorPage from '@/pages/ErrorPage';
import InternalServerCard from '@/pages/ErrorPage/_component/InternalServerCard';
import NotFoundCard from '@/pages/ErrorPage/_component/NotFoundCard';
import FloodPage from '@/pages/Flood';
import FloodDetailPage from '@/pages/FloodDetail';
import ForestFirePage from '@/pages/ForestFire';
import ForestFireDetailPage from '@/pages/ForestFireDetail';
import InventoryInOutStockPage from '@/pages/Inventory/InOutStock';
import ProductionPlanningPage from '@/pages/Inventory/ProductionPlanning/ProductionPlanning';
import InventoryWorkOrderPage from '@/pages/Inventory/WorkOrder';
import LoginPage from '@/pages/Login/LoginPage';
import ManagementAccountPage from '@/pages/Management/Account';
import ManagementAlertPage from '@/pages/Management/Alert';
import ManagementCompanyPage from '@/pages/Management/Company';
import ManagementDevicePage from '@/pages/Management/Device';
import ManagementGatewayPage from '@/pages/Management/Gateway';
import ManagementInventoryPage from '@/pages/Management/Inventory';
import ManagementLocationPage from '@/pages/Management/Location';
import ManagementMachinePage from '@/pages/Management/Machine';
import ManagementRecipePage from '@/pages/Management/Recipe';
import ManagementTagPage from '@/pages/Management/Tag';
import MobileReservationPage from '@/pages/MobileReservation';
import MobileReservationConfirmPage from '@/pages/MobileReservationConfirm';
import MobileReservationDetailPage from '@/pages/MobileReservationDetail';
import ProfilePage from '@/pages/Profile';
import PurchaseOrderPage from '@/pages/PurchaseOrder/PurchaseOrderCreate';
import PurchaseOrderListPage from '@/pages/PurchaseOrder/PurchaseOrderList';
import ReportPage from '@/pages/Report';
import ReservationPage from '@/pages/Reservation/ReservationList';
import ReservationVendorPage from '@/pages/Reservation/ReservationVendor';
import ResetPasswordPage from '@/pages/ResetPassword';
import ResetPasswordConfirmPage from '@/pages/ResetPasswordConfirm';
import SmartPolePage from '@/pages/SmartPole';
import SmartPoleDetailV2Page from '@/pages/SmartPoleDetailV2';
import UnitracePage from '@/pages/Unitrace';
import VerifyEmailPage from '@/pages/VerifyEmail';
import WaterLevelPage from '@/pages/WaterLevel';
import WaterLevelDetailPage from '@/pages/WaterLevelDetail';
import { ROUTES } from '@/utils/configs/route';

import MachineMonitoringPage from './pages/MachineMonitoring';
import MachineMonitoringDetail from './pages/MachineMonitoring/_components/MachineDetail';
import WastePage from './pages/Waste';
import WebSocketTesPage from './pages/WebSocketTest';


function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.base} element={<Redirector />}>
            <Route
              path={ROUTES.login}
              element={<LoginPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path={ROUTES.resetPassword}
              element={<ResetPasswordPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path={ROUTES.confirmResetPassword}
              element={<ResetPasswordConfirmPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path={ROUTES.verifyEmail}
              element={<VerifyEmailPage />}
              errorElement={<ErrorPage />}
            />
            <Route element={<MobileLayout />}>
              <Route
                path={ROUTES.mobileReservation}
                element={<MobileReservationPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.mobileReservationDetail(':reservationId')}
                element={<MobileReservationDetailPage />}
                errorElement={<ErrorPage />}
              />
            </Route>
            <Route element={<MainLayout />}>
              <Route
                path={ROUTES.dashboard}
                element={<DashboardPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeter}
                element={<EnergyMeterPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterGateway(':gatewayId')}
                element={<EnergyMeterPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterAdvanced}
                element={<EnergyMeterPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterAdvancedGateway(':gatewayId')}
                element={<EnergyMeterPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterAdvancedDevices}
                element={<DevicesPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterAdvancedGatewayDevices(':gatewayId')}
                element={<DevicesPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterDevices}
                element={<DevicesPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.energyMeterGatewayDevices(':gatewayId')}
                element={<DevicesPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.waterLevel}
                element={<WaterLevelPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.waterLevelGateway(':gatewayId')}
                element={<WaterLevelPage />}
                errorElement={<ErrorPage />}
              />
               {/* <Route
                path={ROUTES.waterLevelDetail(':id')}
                element={<SmartPoleDetailV2Page />}
                errorElement={<ErrorPage />}
              /> */}
              <Route
                path={ROUTES.waterLevelGatewayDetail(':gatewayId', ':id')}
                element={<WaterLevelDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFireForest}
                element={<ForestFirePage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFireForestGateway(':gatewayId')}
                element={<ForestFirePage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFireForestDetail(':id')}
                element={<ForestFireDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFireForestGatewayDetail(':gatewayId', ':id')}
                element={<ForestFireDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFlood}
                element={<FloodPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFloodGateway(':gatewayId')}
                element={<FloodPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFloodDetail(':id')}
                element={<FloodDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.ewsFloodGatewayDetail(':gatewayId', ':id')}
                element={<FloodDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.employeeTracker}
                element={<EmployeeTrackerPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.employeeTrackerGateway(':gatewayId')}
                element={<EmployeeTrackerPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.employeeTrackerDetail}
                element={<EmployeeTrackerDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.employeeTrackerGatewayDetail(':gatewayId', ':id')}
                element={<EmployeeTrackerDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.smartPole}
                element={<SmartPolePage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.smartPoleGateway(':gatewayId')}
                element={<SmartPolePage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.smartPoleDetail(':id')}
                element={<SmartPoleDetailV2Page />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.smartPoleGatewayDetail(':gatewayId', ':id')}
                element={<SmartPoleDetailV2Page />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.envirobox}
                element={<EnviroboxPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.enviroboxGateway(':gatewayId')}
                element={<EnviroboxPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.enviroboxDetail(':id')}
                element={<EnviroboxDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.enviroboxGatewayDetail(':gatewayId', ':id')}
                element={<EnviroboxDetailPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.machineMonitoring}
                element={<MachineMonitoringPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.machineMonitoringGateway(':gatewayId')}
                element={<MachineMonitoringPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.machineMonitoringDetail}
                element={<MachineMonitoringDetail />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.machineMonitoringGatewayDetail(
                  ':gatewayId',
                  ':id',
                )}
                element={<MachineMonitoringDetail />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.waste}
                element={<WastePage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.wasteMonitoringGateway(':gatewayId')}
                element={<WastePage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.unitraceGateway(':gatewayId')}
                element={<UnitracePage />}
                errorElement={<ErrorPage />}
              />
              <Route path={ROUTES.management} element={<Redirector />}>
                <Route
                  path={ROUTES.managementLocation}
                  element={<ManagementLocationPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementAlert}
                  element={<ManagementAlertPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementAccount}
                  element={<ManagementAccountPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementCompany}
                  element={<ManagementCompanyPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementDevice}
                  element={<ManagementDevicePage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementGateway}
                  element={<ManagementGatewayPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementMachine}
                  element={<ManagementMachinePage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementRecipe}
                  element={<ManagementRecipePage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementInventory}
                  element={<ManagementInventoryPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.managementTag}
                  element={<ManagementTagPage />}
                  errorElement={<ErrorPage />}
                />
              </Route>
              <Route path={ROUTES.inventory} errorElement={<ErrorPage />}>
                <Route
                  path={ROUTES.inventoryWorkOrder}
                  element={<InventoryWorkOrderPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.productionPlanning}
                  element={<ProductionPlanningPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.inventoryInOutStock}
                  element={<InventoryInOutStockPage />}
                  errorElement={<ErrorPage />}
                />
              </Route>
              <Route path={ROUTES.yard} errorElement={<ErrorPage />}>
                <Route
                  path={ROUTES.reservationList}
                  element={<ReservationPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.reservationVendor}
                  element={<ReservationVendorPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.unitrace}
                  element={<UnitracePage />}
                  errorElement={<ErrorPage />}
                />
              </Route>
              <Route path={ROUTES.purchaseOrder} errorElement={<ErrorPage />}>
                <Route
                  path={ROUTES.purchaseOrder}
                  element={<PurchaseOrderListPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.purchaseOrderCreate}
                  element={<PurchaseOrderPage />}
                  errorElement={<ErrorPage />}
                />
                <Route
                  path={ROUTES.purchaseOrderConfirmInventory}
                  element={<PurchaseOrderPage />}
                  errorElement={<ErrorPage />}
                />
              </Route>
              <Route
                path={ROUTES.report}
                element={<ReportPage />}
                errorElement={<ErrorPage />}
              />
              <Route
                path={ROUTES.profile}
                element={<ProfilePage />}
                errorElement={<ErrorPage />}
              />
            </Route>
            <Route
              path={`/websocket`}
              element={<WebSocketTesPage />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="*"
              element={
                <div
                  className={`flex flex-row gap-5 bg-cover bg-fixed bg-no-repeat p-4`}
                >
                  <NotFoundCard />
                </div>
              }
              errorElement={<ErrorPage />}
            />
            <Route
              path={ROUTES.internalError}
              element={
                <div
                  className={`flex flex-row gap-5 bg-cover bg-fixed bg-no-repeat p-4`}
                >
                  <InternalServerCard />
                </div>
              }
              errorElement={<ErrorPage />}
            />
          </Route>
          <Route element={<MobileLayout />}>
            <Route
              path={ROUTES.mobileReservationConfirm(':reservationId')}
              element={<MobileReservationConfirmPage />}
              errorElement={<ErrorPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
