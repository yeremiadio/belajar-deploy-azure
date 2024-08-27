import { http, HttpResponse } from 'msw';

import { UsedAPI } from '@/utils/configs/endpoint';

const allData = new Map();

const baseUrl = `${UsedAPI}/gateway`;

export const exampleData = {
  data: {
    entities: [
      {
        id: 1,
        apikey: '7bde64d7f6595b0ef7e0bc46b0c3b757',
        name: 'Aquasense Hpd',
        code: null,
        sublocation2Id: null,
        status: null,
        companyId: 170,
        moduleId: 5,
        locationId: 319,
        created_by: null,
        created_at: '2024-05-27T17:00:00.000Z',
        deleted_at: null,
        updated_by: null,
        updated_at: '2024-05-27T17:00:00.000Z',
        sublocation2: null,
        location: {
          id: 319,
          name: 'Loc-Sby-testing',
          companyId: 170,
          code: null,
          status: 1,
          coordinate: {
            lat: -7.2574719,
            lng: 112.7520883,
          },
          description: null,
          created_by: -1,
          created_at: '2024-05-27T17:00:00.000Z',
          updated_by: null,
          updated_at: '2024-05-27T17:00:00.000Z',
          deleted_at: null,
        },
        module: {
          id: 5,
          name: 'Aquasense',
        },
        company: {
          id: 170,
          name: 'PT Mega Test',
          description: '',
          created_at: '2024-05-28T07:46:58.422Z',
          updated_at: '2024-05-28T07:46:58.422Z',
          deleted_at: null,
        },
      },
    ],
  },
};

export const exampleRequestData = {
  companyId: 168,
  locationId: 297,
  moduleId: 1,
  name: 'G-Test-Hpd',
};

export const gatewayHandlers = [
  http.get(`${baseUrl}/find`, ({ request }) => {
    const urlParams = new URL(request.url).searchParams;
    const page = urlParams.get('page');
    const take = urlParams.get('take');
    const isPaginated = true;

    if (page === '1' && take === '10' && isPaginated) {
      const data = exampleData;
      return HttpResponse.json(data);
    }
  }),

  http.post(`${baseUrl}/create`, async ({ request }) => {
    let lastKey = 0;
    const newData = await request.json();
    allData.set(++lastKey, newData);

    return HttpResponse.json(newData, { status: 201 });
  }),

  http.patch(`${baseUrl}/update/:id`, async ({ params, request }) => {
    const { id } = params;
    const data = exampleData.data.entities.find(
      (entity) => entity.id === Number(id),
    );

    if (!data) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(request.body, { status: 200 });
  }),

  http.delete(`${baseUrl}/delete/:id`, ({ params }) => {
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
