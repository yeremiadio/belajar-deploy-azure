import { renderHook, waitFor } from '@testing-library/react';

import { customWrapper } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';

import {
  exampleData,
  machineHandlers,
} from '@/tests/mocks/handlers/machineHandlers';
import { useGetMachineQuery } from '@/stores/managementStore/machineStore/machineStoreApi';

describe('Machine API Store', () => {
  initiateServer();

  it('should fetch all machines', async () => {
    const { result } = renderHook(
      () => {
        const { data } = useGetMachineQuery({});
        return data;
      },
      {
        wrapper: customWrapper({
          handlers: machineHandlers,
        }),
      },
    );

    await waitFor(() => {
      expect(result.current).toEqual(exampleData.data);
    });
  });
});
