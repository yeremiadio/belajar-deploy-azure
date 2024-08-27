import { HttpResponse, http } from 'msw';

import { UsedAPI } from '@/utils/configs/endpoint';

const allData = new Map();

const baseUrl = `${UsedAPI}/recipes`;

export const exampleData = {
  data: {
    entities: [
      {
        id: 1,
        createdAt: '2024-05-15T04:01:32.486Z',
        updatedAt: '2024-05-16T08:57:29.274Z',
        name: 'RCP005',
        output: 1.5,
        inventoryId: 35,
        companyId: 39,
        inventory: {
          id: 35,
          createdAt: '2024-05-14T05:54:38.371Z',
          updatedAt: '2024-05-14T07:19:21.987Z',
          deletedAt: null,
          name: 'Benang',
          uniqueId: 'INV-002',
          companyId: 39,
          type: 'finish good',
          unit: 'm',
          price: 1000000,
          stock: 110,
        },
        recipeIngredients: [
          {
            id: 162,
            createdAt: '2024-05-16T08:57:29.274Z',
            updatedAt: '2024-05-16T08:57:29.274Z',
            deletedAt: null,
            amount: '1',
            inventoryId: 35,
            recipeId: 52,
            inventory: {
              id: 35,
              createdAt: '2024-05-14T05:54:38.371Z',
              updatedAt: '2024-05-14T07:19:21.987Z',
              deletedAt: null,
              name: 'Benang',
              uniqueId: 'INV-002',
              companyId: 39,
              type: 'finish good',
              unit: 'm',
              price: 1000000,
              stock: 110,
            },
          },
        ],
        machineRecipes: [],
      },
    ],
  },
};

export const exampleRequestData = {
  inventoryId: 36,
  name: 'RCP HAPED TEST',
  output: 20,
  recipeIngredients: [
    {
      inventoryId: 18,
      amount: 30,
    },
  ],
};

export const recipeHandlers = [
  http.get(`${baseUrl}`, ({ request }) => {
    const urlParams = new URL(request.url).searchParams;
    const page = urlParams.get('page');
    const take = urlParams.get('take');
    const isPaginated = true;

    if (page === '1' && take === '10' && isPaginated) {
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

    return HttpResponse.json({ data: data });
  }),

  http.post(`${baseUrl}`, async ({ request }) => {
    let lastKey = 0;
    const newData = await request.json();
    allData.set(++lastKey, newData);

    return HttpResponse.json(newData, { status: 201 });
  }),

  http.patch(`${baseUrl}/:id`, async ({ params, request }) => {
    const { id } = params;
    const data = exampleData.data.entities.find(
      (entity) => entity.id === Number(id),
    );

    if (!data) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(request.body, { status: 200 });
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
