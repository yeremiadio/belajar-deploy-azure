import * as yup from "yup";

const reservationVehicleValidationSchema = yup.object().shape({
    areaCode: yup.string().required('Area Code is required'),
    plateCode: yup.string().required('Plate Code is required'),
    lastCode: yup.string().required('Last Code is required'),
    class: yup.string().required('Class is required'),
    merk: yup.string().required('Merk is required'),
    series: yup.string().required('Series is required'),
    annotation: yup.string().optional(),
});

export default reservationVehicleValidationSchema;