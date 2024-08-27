const machineDataDummy = [
    {
        "id": 1,
        "machineId": "MAC-1024",
        "name": "Machine ABC",
        "recipes": [
            {
                "id": 1,
                "name": "Recipe A",
                "cycleRate": 1.2
            },
            {
                "id": 2,
                "name": "Recipe B",
                "cycleRate": 2.2
            }
        ],
        "location": {
            "id": 211,
            "name": "IKN-LOC-FIRE-1",
            "companyId": 129,
            "code": null,
            "status": 1,
            "coordinate": {
                "lat": -0.18740738069332705,
                "lng": 116.54835727508629
            },
            "description": null,
            "created_by": -1,
            "created_at": "2024-04-24T17:00:00.000Z",
            "updated_by": null,
            "updated_at": "2024-04-24T17:00:00.000Z",
            "deleted_at": null,
            "shifts": [],
            "sublocation1": [],
            "company": {
                "id": 129,
                "createdAt": "2024-04-25T08:09:14.311Z",
                "updatedAt": "2024-04-25T08:09:14.311Z",
                "deletedAt": null,
                "name": "Badan Otorita IKN",
                "description": "",
                "created_at": "2024-04-25T08:09:14.311Z",
                "updated_at": "2024-04-25T08:09:14.311Z",
                "deleted_at": null
            }
        },
        "groups": [
            {
                "id": 1,
                "name": "Group A"
            },
            {
                "id": 2,
                "name": "Group B"
            }
        ]
    },
    {
        "id": 2,
        "machineId": "MAC-2024",
        "name": "Machine DEF",
        "recipes": [
            {
                "id": 2,
                "name": "Recipe B",
                "cycleRate": 2.2
            }
        ],
        "location": {
            "id": 169,
            "name": "IKN-LOC-FIRE-10",
            "companyId": 129,
            "code": null,
            "status": 1,
            "coordinate": {
                "lat": -0.16366266372703547,
                "lng": 116.69033008888485
            },
            "description": null,
            "created_by": -1,
            "created_at": "2024-04-21T17:00:00.000Z",
            "updated_by": -1,
            "updated_at": "2024-04-21T17:00:00.000Z",
            "deleted_at": null,
            "shifts": [],
            "sublocation1": [],
            "company": {
                "id": 129,
                "createdAt": "2024-04-25T08:09:14.311Z",
                "updatedAt": "2024-04-25T08:09:14.311Z",
                "deletedAt": null,
                "name": "Badan Otorita IKN",
                "description": "",
                "created_at": "2024-04-25T08:09:14.311Z",
                "updated_at": "2024-04-25T08:09:14.311Z",
                "deleted_at": null
            }
        },
        "groups": [
            {
                "id": 1,
                "name": "Group A"
            }
        ]
    }
]

export default machineDataDummy;
