import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import { useToast } from '@/components/ui/use-toast';
import SliderComponent from '@/components/Slider';

import { TModalFormProps } from '@/types/modal';
import {
  TOeeRequestFormObject,
  IWorkOrderResponse,
} from '@/types/api/inventory/workOrder';
import { ErrorMessageBackendDataShape } from '@/types/api';

import oeeThresholdValidationSchema from '@/utils/validations/management/workOrder/oeeValidationSchema';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

import {
  useGetOeeThresholdQuery,
  useUpdateOeeThresholdMutation,
} from '@/stores/oeeStore/oeeStoreApi';

const OeeThresholdForm = ({ toggle }: TModalFormProps<IWorkOrderResponse>) => {
  const { toast } = useToast();

  const { data: oeeThresholdData } = useGetOeeThresholdQuery({});

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<TOeeRequestFormObject>({
    defaultValues: {},
    resolver: yupResolver(oeeThresholdValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [updateOeeThreshold] = useUpdateOeeThresholdMutation();

  useEffect(() => {
    reset({
      oee: [oeeThresholdData?.oee],
      quality: [oeeThresholdData?.quality],
      availability: [oeeThresholdData?.availability],
      performance: [oeeThresholdData?.performance],
    });
  }, [oeeThresholdData, reset]);

  const handleSubmitData: SubmitHandler<TOeeRequestFormObject> = async (
    data,
    event,
  ) => {
    event?.preventDefault();

    const { oee, quality, availability, performance } = data;

    await updateOeeThreshold({
      oee: Number(oee),
      quality: Number(quality),
      availability: Number(availability),
      performance: Number(performance),
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'OEE Threshold is adjusted successfully',
            variant: 'success',
          }),
        );

        toggle();
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        const { title, message } = generateStatusCodesMessage(error.status);
        toast(
          generateDynamicToastMessage({
            title,
            description: `${message} "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
        toggle();
      });
  };

  return (
    <form
      id="oeeForm"
      onSubmit={handleSubmit(handleSubmitData)}
      className="grid grid-cols-1 gap-4"
    >
      <Controller
        name="oee"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <SliderComponent onChange={onChange} value={value} label="OEE" />
          );
        }}
      />

      <Controller
        name="availability"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <SliderComponent
              onChange={onChange}
              value={value}
              label="Availability"
            />
          );
        }}
      />

      <Controller
        name="performance"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <SliderComponent
              onChange={onChange}
              value={value}
              label="Performance"
            />
          );
        }}
      />

      <Controller
        name="quality"
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <SliderComponent
              onChange={onChange}
              value={value}
              label="Quality"
            />
          );
        }}
      />

      <DrawerSubmitAction
        submitText="Save"
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="oeeForm"
      />
    </form>
  );
};

export default OeeThresholdForm;
