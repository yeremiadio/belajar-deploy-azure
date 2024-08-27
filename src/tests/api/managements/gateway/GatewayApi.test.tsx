import {
  useCreateGatewayMutation,
  useDeleteGatewayMutation,
  useGetGatewayListQuery,
  useUpdateGatewayMutation,
} from '@/stores/managementStore/gatewayStoreApi';
import {
  exampleData,
  exampleRequestData,
  gatewayHandlers,
} from '@/tests/mocks/handlers/gatewayHandlers';
import { customWrapper } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';
import { act, renderHook, waitFor } from '@testing-library/react';

describe('Gateway API Store', () => {
  initiateServer();

  describe('Read', () => {
    it('should fetch all gateway', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetGatewayListQuery({
            page: 1,
            take: 10,
            isPaginated: true,
          });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: gatewayHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toEqual(exampleData.data);
      });
    });
  });

  describe('Create', () => {
    it('should create a new gateway', async () => {
      const { result } = renderHook(() => useCreateGatewayMutation(), {
        wrapper: customWrapper({
          handlers: gatewayHandlers,
        }),
      });

      const [createGateway] = result.current;

      act(() => {
        createGateway(exampleRequestData);
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });

  describe('Update', () => {
    it("should update a gateway's output & inventory", async () => {
      const { result } = renderHook(() => useUpdateGatewayMutation(), {
        wrapper: customWrapper({
          handlers: gatewayHandlers,
        }),
      });

      const [patchGateway] = result.current;

      act(() => {
        patchGateway({
          id: 1,
          data: {
            ...exampleRequestData,
            companyId: 24,
            locationId: 64,
          },
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });

  describe('Delete', () => {
    it('should delete a gateway', async () => {
      const { result } = renderHook(() => useDeleteGatewayMutation(), {
        wrapper: customWrapper({
          handlers: gatewayHandlers,
        }),
      });

      const [deleteGateway] = result.current;

      act(() => {
        deleteGateway(1);
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });
});
