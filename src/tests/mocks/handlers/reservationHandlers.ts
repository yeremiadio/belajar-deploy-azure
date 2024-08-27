import { HttpResponse, http } from 'msw';

import { UsedAPI } from '@/utils/configs/endpoint';
import { ReservationActivityStatusEnum } from '@/types/api/reservation';

const allData = new Map();

const baseUrl = `${UsedAPI}/reservations`;

export const exampleData = {
  data: {
    entities: [
      {
        id: 1,
        status: 'CHECKED_OUT',
        workId: 'kkkk',
        dockNumber: '29',
        expectedCheckInDate: '2024-04-26T09:02:04.192Z',
        actualCheckInDate: null,
        waitingDate: '2024-04-26T09:03:29.678Z',
        dockingDate: '2024-05-07T08:26:05.000Z',
        checkOutDate: '2024-04-26T09:06:31.904Z',
        createdAt: '2024-04-26T08:57:02.165Z',
        updatedAt: '2024-04-29T04:05:42.638Z',
        vendor: {
          id: 2,
          name: 'PLN Batam',
          address: 'Batam',
          phoneNumber: '08111234567',
          createdAt: '2024-04-24T09:56:50.987Z',
          updatedAt: '2024-04-24T09:56:50.987Z',
          companyId: 39,
        },
        driver: {
          id: 2,
          name: 'BE Driver',
          createdAt: '2024-04-24T09:56:27.950Z',
          updatedAt: '2024-04-24T09:56:27.950Z',
          companyId: 39,
        },
        licensePlate: {
          id: 2,
          plate: '15200',
          createdAt: '2024-04-24T09:59:10.121Z',
          updatedAt: '2024-04-24T09:59:10.121Z',
          companyId: 39,
        },
        reservationItems: [],
        tag: null,
        dock: {
          id: 469,
          name: 'Dock C9',
          code: 29,
          gatewayId: 287,
          status: 1,
          description: null,
          devicetypeId: 9,
          companyId: 39,
          machineId: null,
          alert_status: 'NORMAL',
          created_at: '2024-04-25T08:59:07.462Z',
          updated_at: '2024-04-25T08:59:07.462Z',
        },
      },
    ],
  },
};

export const exampleRequestData = {
  documentId: 'DOC-1',
  category: 'INBOUND',
  isPriority: true,
  expectedCheckInDate: new Date('2024-06-02T09:12:09.873Z'),
  vendorId: 1,
  driverId: 1,
  licensePlateId: 1,
  tagId: 1,
  orderDeliveryId: 1,
  reservationItems: [
    {
      inventoryId: 1,
      amount: 5,
      unit: 'kg',
    },
  ],
};

export const reservationHandlers = [
  http.get(`${baseUrl}`, ({ request }) => {
    const urlParams = new URL(request.url).searchParams;
    const page = urlParams.get('page');
    const take = urlParams.get('take');
    const isCompleted = urlParams.get('isCompleted');

    if (page === '1' && take === '10' && isCompleted === 'false') {
      const data = exampleData;
      return HttpResponse.json(data);
    }
  }),

  http.get(`${baseUrl}/:id`, ({ params }) => {
    const { id } = params;
    const data = exampleData.data.entities.find(
      (entity) => entity.id === Number(id),
    );

    if (!data) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      data: data,
    });
  }),

  http.get(`${baseUrl}/all`, () => {
    const data = exampleData;
    return HttpResponse.json(data);
  }),

  http.post(`${baseUrl}`, async ({ request }) => {
    let lastKey = 0;
    const newData = await request.json();
    allData.set(++lastKey, newData);

    return HttpResponse.json(newData, { status: 201 });
  }),

  http.patch(`${baseUrl}/:id`, async ({ params, request }) => {
    const { id } = params;
    const updatedStatus =
      (await request.text()) as ReservationActivityStatusEnum;
    const data = exampleData.data.entities.find(
      (entity) => entity.id === Number(id),
    );

    if (!data) {
      return new HttpResponse(null, { status: 404 });
    }
    data.status = updatedStatus;

    return HttpResponse.json(data, { status: 200 });
  }),

  http.delete(`${baseUrl}/:id`, ({ params }) => {
    const { id } = params;
    const data = exampleData.data.entities.filter(
      (entity) => entity.id !== Number(id),
    );

    if (!data) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(data, { status: 200 });
  }),
];
