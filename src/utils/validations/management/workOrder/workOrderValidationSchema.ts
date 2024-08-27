import * as yup from "yup";

const workOrderValidationSchema = yup.object().shape({
  name: yup.string().required('Work Order Name is required.'),
  recipe: yup.number().required('Recipe is required.'),
  targetProduction: yup.number().required('Target Production is required.').typeError('Only numbers allowed.'),
  plannedTime: yup.number()
    .required('Planned Time is required.')
    .typeError('Only numbers allowed.')
    .min(yup.ref('minPlannedTime'), ({ min }) => `Minimum Planned Time: ${min} hours.`),
  scheduledDowntime: yup.number().required('Scheduled Downtime is required.').typeError('Only numbers allowed.'),
  startDate: yup.date().required('Start Date Plan is required.'),
  endDate: yup.date().required('End Date Plan is required.'),
  machine: yup.number().required('Machine is required.'),
  minPlannedTime: yup.number()
});


export default workOrderValidationSchema;