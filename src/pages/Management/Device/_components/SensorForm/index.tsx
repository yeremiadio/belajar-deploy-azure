import { FC, useEffect } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ui/use-toast';
import { useCreateSensorRelationMutation } from '@/stores/managementStore/deviceStore/deviceSensorStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { IDeviceDetailSublocationMachineWithMap } from '@/types/api/management/device';
import { TSensorRequestFormObject } from '@/types/api/management/sensor';
import { TModalFormProps } from '@/types/modal';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import handleInputChangeNumberOnly from '@/utils/functions/handleInputNumberOnly';
import useSensorOpts from '@/utils/hooks/selectOptions/useSensorOptions';
import sensorValidationSchema from '@/utils/validations/sensorValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

const SensorForm: FC<
  TModalFormProps<IDeviceDetailSublocationMachineWithMap>
> = ({ toggle, id, data }) => {
  const { arr: sensorOpt, isLoading: isLoadingSensorOpts } = useSensorOpts({});
  const [createSensorRelation, { isLoading: isLoadingCreateSensor }] =
    useCreateSensorRelationMutation();

  const excistingSensorIds = data?.devicesensorrelation.map(
    (item) => item.sensorId,
  );

  const filteredSensorOpt = sensorOpt.filter(
    (item) => !excistingSensorIds?.includes(item.id),
  );

  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    watch,
  } = useForm<TSensorRequestFormObject>({
    defaultValues: {
      selectedSensorIds: [],
    },
    resolver: yupResolver(sensorValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const { fields: fieldsSensorData, append: appendSensorData } = useFieldArray({
    control,
    name: 'sensorsData',
  });
  const { selectedSensorIds, sensorsData } = watch();

  // re-assign data based on selected sensor
  useEffect(() => {
    if (!selectedSensorIds || selectedSensorIds.length === 0) return;

    selectedSensorIds.forEach((selectedSensorId) => {
      const isHaxMaxValue =
        filteredSensorOpt.find((sensor) => sensor.id === selectedSensorId)
          ?.hasThreshold === true;

      const isSensorDataExist = sensorsData.find(
        (item) => item.sensorId === selectedSensorId,
      );

      if (isHaxMaxValue && !isSensorDataExist) {
        appendSensorData({
          sensorId: selectedSensorId,
          maxValue: 0,
          minValue: 0,
        });
      }
    });
  }, [selectedSensorIds]);

  const handleSubmitData: SubmitHandler<TSensorRequestFormObject> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    const { sensorsData, selectedSensorIds } = data;

    const sensorsWithoutMaxValue = selectedSensorIds
      ?.filter((sensorId) => {
        return !sensorsData.find((item) => item.sensorId === sensorId);
      })
      ?.map((sensorId) => ({
        sensorId,
      })) as TSensorRequestFormObject['sensorsData'];

    await createSensorRelation({
      sensorsData: [...sensorsData, ...sensorsWithoutMaxValue],
      deviceId: id ?? 0,
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Sensor is added successfully',
            variant: 'success',
          }),
        );
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
      });
  };

  return (
    <form id="sensorForm" onSubmit={handleSubmit(handleSubmitData)}>
      <div className="mb-10 grid grid-cols-1 gap-4">
        <Controller
          name="selectedSensorIds"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                required
                label="Sensor Type"
                mode="multiple"
                placeholder="Select Sensor Type"
                loading={isLoadingSensorOpts}
                options={filteredSensorOpt}
              />
            );
          }}
        />
        {fieldsSensorData.map((field, index) => (
          <Controller
            key={index}
            name={`sensorsData.${index}.maxValue`}
            control={control}
            render={({
              field: { onChange, value, onBlur },
              fieldState: { error },
            }) => {
              const sensor = filteredSensorOpt.find(
                (sensor) => sensor.id === field.sensorId,
              );
              return (
                <InputComponent
                  label={`Maximum Limit Value - ${sensor?.name}`}
                  placeholder={`Maximum Limit Value for ${sensor?.name}`}
                  onChange={onChange}
                  onBlur={onBlur}
                  onInput={handleInputChangeNumberOnly}
                  value={value}
                  errorMessage={error?.message}
                />
              );
            }}
          />
        ))}
      </div>

      <DrawerSubmitAction
        submitText={
          isLoadingCreateSensor ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : (
            'Add sensor'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="sensorForm"
      />
    </form>
  );
};

export default SensorForm;
