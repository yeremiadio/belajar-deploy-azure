import * as yup from 'yup';

const newGroupMachineValidationSchema = yup.object().shape({
    name: yup.string().required("Group Name is required"),
});

export default newGroupMachineValidationSchema;
