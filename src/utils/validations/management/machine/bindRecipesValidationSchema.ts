import * as yup from 'yup';

const bindRecipesValidationSchema = yup.object().shape({
    bindRecipes: yup.array().of(
        yup.object().shape({
            id: yup.number().positive().integer().optional(),
            recipe: yup.object().shape({
                label: yup.string(),
                value: yup.number().nullable(),
            }).required('Recipe ID is Required'),

            cycleRate: yup.number().transform((value) => (isNaN(value) ? undefined : value)).required('Cycle Rate is Required'),
        }),
    ),
});

export default bindRecipesValidationSchema;
