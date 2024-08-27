import * as yup from 'yup';

const manageMachineGroupValidationSchema = yup.object().shape({
    machineGroups: yup.array().of(
        yup.object().shape({
            id: yup.number().integer().positive().optional(),
            name: yup.string().required(),
            isShow: yup.boolean(),
        }),
    ),
});

export default manageMachineGroupValidationSchema;
