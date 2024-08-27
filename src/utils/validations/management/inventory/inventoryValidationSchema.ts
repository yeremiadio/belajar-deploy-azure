import * as yup from "yup";

const inventoryValidationSchema = yup.object().shape({
	uniqueId: yup.string().required('Inventory ID is required'),
	name: yup.string().required('Inventory name is required'),
	type: yup.string().required('Inventory type is required'),
	unit: yup.string().required('Inventory unit is required'),
	price: yup.number().required('Inventory price is required'),
});

export default inventoryValidationSchema;