import * as yup from 'yup';

const workOrderProductionLogValidationSchema = yup.object().shape({
  productionOutput: yup
    .number()
    .required('Production Output is required')
    .min(0, 'Production Output must be greater than 0'),
  notGoodProductionOutput: yup
    .number()
    .required('Not Good Product is required')
    .min(0, 'Not Good Product must be greater than 0')
    .test(
      'isLessThanProductionOutput',
      'Not Good Product must be less than Production Output',
      function (value) {
        const productionOutput = this.parent.productionOutput;
        return value <= productionOutput;
      },
    ),
});

export default workOrderProductionLogValidationSchema;
