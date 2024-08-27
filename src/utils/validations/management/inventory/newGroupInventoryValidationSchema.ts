import * as yup from 'yup';

const newGroupInventoryValidationSchema = yup.object().shape({
    name: yup.string().required("Group Name is required"),
});

export default newGroupInventoryValidationSchema;
