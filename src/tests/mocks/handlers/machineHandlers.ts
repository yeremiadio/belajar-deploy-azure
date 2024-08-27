import { HttpResponse, http } from 'msw';

import { UsedAPI } from '@/utils/configs/endpoint';
import { createUrlParams } from '@/tests/mocks/handlers/utils/createUrlParams';

const allData = new Map();

const baseUrl = `${UsedAPI}/machines`;

export const exampleData = {
    "data": {
        "entities": [
            {
                "id": 43,
                "code": "M001",
                "name": "Machine001",
                "createdAt": "2024-05-08T01:20:16.224Z",
                "updatedAt": "2024-05-08T01:41:10.529Z",
                "location": {
                    "id": 83,
                    "name": "Pabrik CPU",
                    "companyId": 39,
                    "code": "BECPU-1",
                    "status": 1,
                    "coordinate": {
                        "lat": -6.294108299999999,
                        "lng": 106.797059
                    },
                    "description": null,
                    "created_at": "2022-09-01T17:00:00.000Z",
                    "updated_at": "2022-09-01T17:00:00.000Z"
                },
                "machineGroups": [
                    {
                        "id": 37,
                        "name": "group a",
                        "companyId": 39,
                        "isShow": true,
                        "createdAt": "2024-05-14T08:05:19.488Z",
                        "updatedAt": "2024-05-15T01:19:11.173Z",
                        "deletedAt": null
                    },
                    {
                        "id": 35,
                        "name": "group test",
                        "companyId": 39,
                        "isShow": true,
                        "createdAt": "2024-05-14T05:45:45.105Z",
                        "updatedAt": "2024-05-15T01:19:11.165Z",
                        "deletedAt": null
                    }
                ],
                "machineRecipes": [
                    {
                        "id": 63,
                        "createdAt": "2024-05-15T02:26:05.261Z",
                        "updatedAt": "2024-05-15T02:26:05.261Z",
                        "cycleRate": 50,
                        "machineId": 43,
                        "recipeId": 39,
                        "recipe": {
                            "id": 39,
                            "createdAt": "2024-05-14T01:17:43.855Z",
                            "updatedAt": "2024-05-15T01:45:53.882Z",
                            "name": "ureaa33",
                            "output": null,
                            "inventoryId": 18,
                            "companyId": 39
                        }
                    }
                ]
            },
            {
                "id": 45,
                "code": "M003",
                "name": "Machine 003",
                "createdAt": "2024-05-14T06:25:18.558Z",
                "updatedAt": "2024-05-14T06:25:11.479Z",
                "location": {
                    "id": 83,
                    "name": "Pabrik CPU",
                    "companyId": 39,
                    "code": "BECPU-1",
                    "status": 1,
                    "coordinate": {
                        "lat": -6.294108299999999,
                        "lng": 106.797059
                    },
                    "description": null,
                    "created_at": "2022-09-01T17:00:00.000Z",
                    "updated_at": "2022-09-01T17:00:00.000Z"
                },
                "machineGroups": [],
                "machineRecipes": [
                    {
                        "id": 61,
                        "createdAt": "2024-05-14T10:09:28.184Z",
                        "updatedAt": "2024-05-15T02:37:35.505Z",
                        "cycleRate": 0,
                        "machineId": 45,
                        "recipeId": 31,
                        "recipe": {
                            "id": 31,
                            "createdAt": "2024-05-13T08:16:00.755Z",
                            "updatedAt": "2024-05-13T08:19:14.993Z",
                            "name": "KAYU JATI 001",
                            "output": null,
                            "inventoryId": 18,
                            "companyId": 39
                        }
                    },
                    {
                        "id": 62,
                        "createdAt": "2024-05-14T10:09:28.184Z",
                        "updatedAt": "2024-05-14T11:46:39.783Z",
                        "cycleRate": 0,
                        "machineId": 45,
                        "recipeId": 38,
                        "recipe": {
                            "id": 38,
                            "createdAt": "2024-05-14T00:59:15.116Z",
                            "updatedAt": "2024-05-14T00:59:15.116Z",
                            "name": "UREAA230",
                            "output": null,
                            "inventoryId": 18,
                            "companyId": 39
                        }
                    }
                ]
            },
        ],
        "meta": {
            "page": 1,
            "offset": 10,
            "itemCount": 2,
            "pageCount": 1
        }
    }
};

export const exampleRequestData = {
    "name": "Machine ABC",
    "code": "MachineABC",
    "locationId": 1
}

export const machineHandlers = [
    http.get(
        createUrlParams(baseUrl, { page: 1, take: 10, }),
        () => {
            const data = exampleData;
            return HttpResponse.json(data);
        },
    ),

    http.get(`${baseUrl}/:id`, ({ params }) => {
        const { id } = params;
        const data = exampleData.data.entities.find(
            (entity) => entity.id === Number(id),
        );
        return HttpResponse.json(data);
    }),

    http.post(
        `${baseUrl}`,
        ({
            request = {
                body: exampleRequestData,
            },
        }) => {
            const { body } = request;
            return HttpResponse.json(body);
        },
    ),

    http.delete(`${baseUrl}/:id`, ({ params }) => {
        const { id } = params;
        const deletedData = allData.get(id);

        if (!deletedData) {
            return new HttpResponse(null, { status: 404 });
        }

        allData.delete(id);
        return HttpResponse.json(deletedData);
    }),
];
