import * as yup from 'yup';

const inventoryGroupPriceSchema = yup.object().shape({
    inventoryGroupsPrice: yup.array().of(
        yup.object().shape({
            groupId: yup.number(),
            name: yup.string(),
            price: yup.number(),
        }),
    ),
});

export default inventoryGroupPriceSchema;