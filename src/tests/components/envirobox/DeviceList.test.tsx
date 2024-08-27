import { describe, it } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/tests/setup';

import { TGatewayDevice } from '@/types/api/socket';

import DeviceList from '@/pages/Envirobox/_components/DeviceList';

const dummyData = [
  {
    id: 594,
    name: 'Dev-Env-Box-11',
    code: 11,
    status: 1,
    description: null,
    machineId: null,
    alert_status: 'WARNING',
    created_by: -1,
    created_at: '2024-05-22T03:18:48.736Z',
    updated_by: null,
    updated_at: '2024-08-13T07:15:00.322Z',
    location: {
      id: 307,
      name: 'Env-Pamulang Timur',
      coordinate: {
        lat: -6.3503549,
        lng: 106.7441048,
      },
    },
    sensorlog: {
      deviceId: 594,
      id: '21041014',
      receivedon: '2024-08-13T07:15:00.258Z',
      data: [
        {
          sensorcode: 'hmdt',

          value: '17.04',
          alert: {
            alertlog: {
              id: 798312,
              receivedon: '2024-08-13T07:15:00.258Z',
              value: 17.04,
              status: 'on',
            },
            id: 255,
            name: 'Warning-ENV-Hmdt',
            sensortypeId: 0,
            companyId: 0,
            sign: -2,
            value: 70,
            threatlevel: 1,
            status: 1,
            status_email: 0,
            status_whatsapp: 0,
            email: null,
            whatsapp: null,
            created_at: '2024-06-27T05:09:05.996Z',
            updated_at: '2024-07-04T08:15:26.672Z',
            deleted_at: null,
          },
        },
        {
          sensorcode: 'temp',
          value: '26.91',
          alert: null,
        },
        {
          sensorcode: 'apre',
          value: '27.48',
          alert: null,
        },
      ],
    },
  },
  {
    id: 592,
    name: 'Dev-Env-Box-9',
    code: 9,
    status: 1,
    description: null,
    machineId: null,
    alert_status: 'WARNING',
    created_by: -1,
    created_at: '2024-05-22T03:17:42.885Z',
    updated_by: null,
    updated_at: '2024-06-28T07:16:13.468Z',
    location: {
      id: 310,
      name: 'Env-Pondok Cabe Udik',
      coordinate: {
        lat: -6.3497694,
        lng: 106.7617984,
      },
    },
    sensorlog: {
      deviceId: 592,
      id: '21041017',
      receivedon: '2024-08-13T07:15:00.258Z',
      data: [
        {
          sensorcode: 'hmdt',
          value: '36.06',
          alert: {
            alertlog: {
              id: 734241,
              receivedon: '2024-06-28T07:16:35.940Z',
              value: 54.79,
              status: 'on',
            },
            companyId: 0,
            sensortypeId: 0,
            id: 255,
            name: 'Warning-ENV-Hmdt',
            sign: -2,
            value: 70,
            threatlevel: 1,
            status: 1,
            status_email: 0,
            status_whatsapp: 0,
            email: null,
            whatsapp: null,
            created_at: '2024-06-27T05:09:05.996Z',
            updated_at: '2024-07-04T08:15:26.672Z',
            deleted_at: null,
          },
        },
        {
          sensorcode: 'temp',
          value: '20.15',
          alert: null,
        },
        {
          sensorcode: 'apre',
          value: '32.05',
          alert: null,
        },
      ],
    },
  },
] as unknown as TGatewayDevice[];

describe('Device List Envirobox', () => {
  it('Should show loading if isLoading parameter is true', () => {
    renderWithProviders(
      <DeviceList
        isLoading={true}
        devices={[]}
        toggleSelectedDevice={() => {}}
      />,
    );

    const loadingIndicator = screen.getByTestId('loading-spinner');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('Should show device list if isLoading parameter is false and data is not empty', () => {
    renderWithProviders(
      <DeviceList
        isLoading={false}
        devices={dummyData}
        toggleSelectedDevice={() => {}}
      />,
    );

    const device1 = screen.getByTestId('Dev-Env-Box-11');
    const device2 = screen.getByTestId('Dev-Env-Box-9');

    expect(device1).toBeInTheDocument();
    expect(device2).toBeInTheDocument();
  });

  it('Should scroll to selected device', () => {
    const selected = dummyData[0];

    renderWithProviders(
      <DeviceList
        isLoading={false}
        devices={dummyData}
        toggleSelectedDevice={() => {}}
        selectedDevice={selected}
      />,
    );

    const device1 = screen.getByTestId('Dev-Env-Box-11');
    const device2 = screen.getByTestId('Dev-Env-Box-9');

    setTimeout(() => {
      expect(device1.classList.contains('env-selected')).toBeTruthy();
      expect(device2.classList.contains('env-selected')).toBeFalsy();
    }, 500);
  });

  it('Should call toggleSelectedDevice when a device is clicked', () => {
    const mockToggleSelectedDevice = vi.fn();

    renderWithProviders(
      <DeviceList
        isLoading={false}
        devices={dummyData}
        toggleSelectedDevice={mockToggleSelectedDevice}
      />,
    );

    const device1 = screen.getByTestId('Dev-Env-Box-11');
    device1.click();

    expect(mockToggleSelectedDevice).toHaveBeenCalledTimes(1);
    expect(mockToggleSelectedDevice).toHaveBeenCalledWith(dummyData[0]);
  });
});
