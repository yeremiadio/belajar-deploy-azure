import { describe, vi } from 'vitest';
import axios from 'axios';

import { loadCookie } from '@/services/cookie';

import { UsedAPI } from '@/utils/configs/endpoint';

import { purchaseOrderDummyData } from '@/utils/dummies/purchaseOrder/purchaseOrderDummy';

import { OrderStatusEnum } from '@/types/api/order';

const token = loadCookie('token');

axios.defaults.baseURL = `${UsedAPI}/purchase-order`;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const getPurchaseOrder = async (params: { search: string }) => {
  return await axios.get('', { params });
};

const updatePurchaseOrder = async (id: number, status: OrderStatusEnum) => {
  return await axios.put(`/${id}`, { status });
};

vi.mock('axios');

describe('Purchase Order Endpoints', () => {
  const params = {
    search: '',
  };

  describe('Get Data', () => {
    it('should GET Purchase Order data', async () => {
      (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
        data: purchaseOrderDummyData,
      });
      const res = await getPurchaseOrder(params);
      expect(res.data).toBeDefined();
    });
  });

  describe('Update Data', () => {
    it('should PUT Purchase Order data', async () => {
      const id = 12;
      const status = OrderStatusEnum.CONFIRMED;

      (axios.put as jest.MockedFunction<typeof axios.put>).mockResolvedValue({
        data: { message: 'Purchase Order is successfully updated' },
      });
      const res = await updatePurchaseOrder(id, status);
      expect(res.data).toBeDefined();
    });

    it('should fail to PUT Purchase Order data', async () => {
      const id = 1;
      const status = 'checked in';

      (axios.put as jest.MockedFunction<typeof axios.put>).mockResolvedValue({
        data: { message: 'Failed updating purchase order' },
      });

      try {
        await updatePurchaseOrder(id, status as OrderStatusEnum);
      } catch (error: any) {
        expect(error.response.data).toEqual({
          message: 'Failed to update reservation',
        });
      }
    });
  });
});
