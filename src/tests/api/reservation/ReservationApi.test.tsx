import { act, renderHook, waitFor } from '@testing-library/react';

import { customWrapper } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';

import {
  exampleData,
  exampleRequestData,
  reservationHandlers,
} from '@/tests/mocks/handlers/reservationHandlers';

import {
  useDeleteReservationMutation,
  useGetReservationByIdQuery,
  useGetReservationQuery,
  usePatchReservationMutation,
  usePostReservationMutation,
} from '@/stores/reservationStore/reservationStoreApi';
import { ReservationActivityStatusEnum } from '@/types/api/reservation';

describe('Reservation API Store', () => {
  initiateServer();

  describe('Read', () => {
    it('should fetch all reservations', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetReservationQuery({
            page: 1,
            take: 10,
            isCompleted: false,
          });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: reservationHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toEqual(exampleData.data);
      });
    });

    it('should fetch a single reservation', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetReservationByIdQuery({ id: 1 });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: reservationHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toEqual(exampleData.data.entities[0]);
      });
    });

    it('should return undefined if reservation is not found', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetReservationByIdQuery({ id: 1000 });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: reservationHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toBeUndefined();
      });
    });
  });

  describe('Create', () => {
    it.skip('should post a new reservation', async () => {
      const { result } = renderHook(() => usePostReservationMutation(), {
        wrapper: customWrapper({
          handlers: reservationHandlers,
        }),
      });

      const [postReservation] = result.current;

      act(() => {
        postReservation(exampleRequestData);
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });

  describe('Update', () => {
    it('should update a reservation status', async () => {
      const { result } = renderHook(() => usePatchReservationMutation(), {
        wrapper: customWrapper({
          handlers: reservationHandlers,
        }),
      });

      const [patchReservation] = result.current;

      act(() => {
        patchReservation({
          id: 1,
          status: ReservationActivityStatusEnum.DOCKING,
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });

  describe('Delete', () => {
    it('should delete a reservation', async () => {
      const { result } = renderHook(() => useDeleteReservationMutation(), {
        wrapper: customWrapper({
          handlers: reservationHandlers,
        }),
      });

      const [deleteReservation] = result.current;

      act(() => {
        deleteReservation({
          id: 1,
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });
});
