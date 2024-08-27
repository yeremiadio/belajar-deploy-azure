import * as yup from 'yup';

const sensorValidationSchema = yup.object().shape({
  selectedSensorIds: yup
    .array()
    .of(yup.number().defined())
    .required('Sensor Types are required'),
  sensorsData: yup
    .array()
    .of(
      yup.object().shape({
        sensorId: yup.number().positive().required(),
        maxValue: yup.number().positive().min(0).default(0).required(),
        minValue: yup.number().positive().min(0).default(0).required(),
      }),
    )
    .required(),
});

export default sensorValidationSchema;
