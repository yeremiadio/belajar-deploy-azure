import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  IAlert,
  IAlertRelation,
  IBindDeviceAlertRequestFormObject,
} from '@/types/api/management/alert';
import { TModalFormProps } from '@/types/modal';
import { ErrorMessageBackendDataShape } from '@/types/api';

import bindDeviceValidationSchema from '@/utils/validations/bindDeviceValidationSchema';
import useDeviceRelationOptions from '@/utils/hooks/selectOptions/useDeviceRelationOptions';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';

import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';
import useCustomPaginationController from '@/components/Table/BaseTable/_components/useCustomPaginationController';

import { useCreateRelationsAlertMutation } from '@/stores/alertStore/alertStoreApi';

const BindDeviceForm = ({ data, toggle }: TModalFormProps<IAlert>) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<IBindDeviceAlertRequestFormObject>({
    defaultValues: {
      relationIds: [],
    },
    resolver: yupResolver(bindDeviceValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  // pagination
  const { page, take, setLimit } = useCustomPaginationController({
    defaultPage: 1,
    defaultTake: 10,
  });
  const { toast } = useToast();
  const [createRelationAlert, { isLoading: isLoadingCreateRelationAlert }] =
    useCreateRelationsAlertMutation();
  const {
    arr: deviceSensorOption,
    isLoading: isLoadingDeviceSensorOption,
    meta,
  } = useDeviceRelationOptions(
    { sensortypeId: data?.sensortypeId ?? 0, page, take },
    { skip: !data?.sensortypeId },
  );
  const filterDeviceRelationOptions = useMemo(() => {
    const deviceSensorOpt = [...deviceSensorOption];
    const existingDeviceRelationIds = data?.devsenalertrelation.map(
      (item) => item.devicesensorrelationId,
    );
    const filtered = deviceSensorOpt.filter(
      (item) => !existingDeviceRelationIds?.includes(item.value),
    );
    return filtered;
  }, [deviceSensorOption, data]);

  const handleSubmitItem = useCallback<
    SubmitHandler<IBindDeviceAlertRequestFormObject>
  >(
    async (formData, event) => {
      event?.preventDefault();
      const fulfillCallback = () => {
        toggle();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Success Bind devices',
            variant: 'success',
          }),
        );
      };
      const rejectCallback = (error: ErrorMessageBackendDataShape) => {
        toggle();
        toast(
          generateDynamicToastMessage({
            title: 'Error!',
            description: `There was an error while binding devices. ${error?.data?.message ?? ''}`,
            variant: 'error',
          }),
        );
      };
      const submitData: IAlertRelation = {
        relationIds: formData.relationIds ?? [],
        alertIds: data?.id ? [data?.id] : [],
      };
      if (!data) return;
      await createRelationAlert({
        ...submitData,
      })
        .unwrap()
        .then(() => fulfillCallback())
        .catch((e: ErrorMessageBackendDataShape) => rejectCallback(e));
    },
    [toggle, data, createRelationAlert, toast],
  );
  const isRequired = (
    fieldName: keyof IBindDeviceAlertRequestFormObject,
  ): boolean => {
    const value = isFieldRequired<IBindDeviceAlertRequestFormObject>(
      bindDeviceValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleLoadMore = () => {
    setLimit((prev) => prev + 10);
  };

  /**
   * @description Pagination Dropdown Select Option
   * @todo Refactor this soon as independent component
   * @param param0
   * @returns
   */
  const Loading = ({ onLoad }: { onLoad: () => void }) => {
    if (meta && meta.pageCount > 1) {
      useEffect(() => {
        setTimeout(onLoad, 1000);
      }, [meta]);

      return <div>Loading...</div>;
    } else {
      return null;
    }
  };

  return (
    <form id="bindDeviceForm" onSubmit={handleSubmit(handleSubmitItem)}>
      <Controller
        name="relationIds"
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectComponent
            value={value}
            onChange={onChange}
            options={[
              ...filterDeviceRelationOptions,
              {
                label: <Loading onLoad={handleLoadMore} />,
                value: 'loading',
              },
            ]}
            loading={isLoadingDeviceSensorOption}
            required={isRequired('relationIds')}
            disabled={isLoadingDeviceSensorOption}
            label="Device"
            mode="multiple"
            placeholder="Select device..."
          />
        )}
      />
      <DrawerFooter className="flex flex-row justify-end gap-4 pt-4 pr-0 pb-0">
        <DrawerClose asChild>
          <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
            Cancel
          </Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button
            type="submit"
            form="bindDeviceForm"
            disabled={!isValid || !isDirty || isLoadingCreateRelationAlert}
            className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue disabled:disabled-btn-disabled-slate-blue"
          >
            {isLoadingCreateRelationAlert ? (
              <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
            ) : (
              'Bind Device'
            )}
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
};

export default BindDeviceForm;
