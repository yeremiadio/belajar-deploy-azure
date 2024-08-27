import * as yup from 'yup';

const manageInventoryGroupValidationSchema = yup.object().shape({
    inventoryGroups: yup.array().of(
        yup.object().shape({
            id: yup.number(),
            name: yup.string().required(),
            isShow: yup.boolean(),
        }),
    ),
});

export default manageInventoryGroupValidationSchema;
