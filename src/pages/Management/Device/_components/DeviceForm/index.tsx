import { FC, useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';

import { TModalFormProps } from '@/types/modal';
import { TDeviceRequestFormObject } from '@/types/api/management/device';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { IDeviceDetailSublocationMachineWithMap } from '@/types/api/management/device';

import deviceValidationSchema from '@/utils/validations/management/device/deviceValidationSchema';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useLocationOpts from '@/utils/hooks/selectOptions/useLocationOptions';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useGatewayOpts from '@/utils/hooks/selectOptions/useGatewayOptions';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import useDeviceTypeOpts from '@/utils/hooks/selectOptions/useDeviceTypeOptions';
import useUserType from '@/utils/hooks/auth/useUserType';

import {
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
} from '@/stores/managementStore/deviceStore/deviceStoreApi';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const DeviceForm: FC<
  TModalFormProps<IDeviceDetailSublocationMachineWithMap>
> = ({ id, toggle, data }) => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    watch,
  } = useForm<TDeviceRequestFormObject>({
    defaultValues: {
      name: data?.name,
      devicetypeId: data?.devicetypeId,
      companyId: data?.companyId,
      gatewayId: data?.gatewayId,
      locationId: data?.location?.id,
    },
    resolver: yupResolver(deviceValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const [searchLocation, setSearchLocation] = useState<string>('');

  const userType = useUserType();

  const { arr: companyOpt, isLoading: isLoadingCompanyOpts } = useCompanyOpts({
    isPaginated: false,
  });

  const { arr: locationOpts, isLoading: isLoadingLocationOpts } =
    useLocationOpts(
      removeEmptyObjects(
        {
          companyId: watch('companyId') ?? undefined,
          search: searchLocation ?? undefined,
          isPaginated: false,
        },
        true,
      ),
      {
        skip: !watch('companyId'),
      },
    );

  const { arr: gatewayOpt, isLoading: isLoadingGatewayOpts } = useGatewayOpts(
    { companyId: watch('companyId'), isPaginated: false },
    {
      skip: !watch('companyId'),
    },
  );
  const handleOnSearchLocation = (val: string) => {
    setSearchLocation(val);
  };
  const { arr: deviceTypeOpts, isLoading: isLoadingDeviceTypeOpts } =
    useDeviceTypeOpts();
  const [createDevice, { isLoading: isLoadingCreateDevice }] =
    useCreateDeviceMutation();
  const [updateDevice, { isLoading: isLoadingUpdateDevice }] =
    useUpdateDeviceMutation();
  const { toast } = useToast();

  const sysadminPermission = userType === 'systemadmin';

  const handleSubmitData: SubmitHandler<TDeviceRequestFormObject> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    const { name, companyId, devicetypeId, gatewayId, locationId } = data;

    const handleDeviceApi = () => {
      const obj = {
        name,
        companyId,
        gatewayId,
        devicetypeId,
        locationId,
      };

      if (id) {
        return updateDevice({
          id,
          data: {
            ...obj,
          },
        });
      } else {
        return createDevice(obj);
      }
    };

    await handleDeviceApi()
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Device is ${id ? 'updated' : 'added'} successfully`,
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
    <form id="deviceForm" onSubmit={handleSubmit(handleSubmitData)}>
      <div className="gap-4 grid mb-10">
        <Controller
          name="companyId"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                placeholder="Select Company"
                required
                loading={isLoadingCompanyOpts}
                options={companyOpt}
                disabled={id ? !sysadminPermission : false}
                label="Company"
              />
            );
          }}
        />
        <Controller
          name="name"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Device Name"
                placeholder="Device Name"
                onChange={onChange}
                onBlur={onBlur}
                required
                value={value}
                errorMessage={error?.message}
              />
            );
          }}
        />
        <Controller
          name="devicetypeId"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <SelectComponent
                label="Device Type"
                placeholder="Select Device Type"
                onChange={onChange}
                required
                value={value}
                disabled={id ? !sysadminPermission : false}
                errorMessage={error?.message}
                options={deviceTypeOpts}
                loading={isLoadingDeviceTypeOpts}
              />
            );
          }}
        />
        <Controller
          name="gatewayId"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                label="Gateway"
                disabled={id ? !sysadminPermission : !watch('companyId')}
                required
                placeholder="Select Gateway"
                loading={isLoadingGatewayOpts}
                options={gatewayOpt}
              />
            );
          }}
        />
        <Controller
          name="locationId"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                label="Location"
                onSearch={handleOnSearchLocation}
                options={locationOpts}
                disabled={id ? !sysadminPermission : !watch('gatewayId')}
                placeholder="Select Location"
                loading={isLoadingLocationOpts}
              />
            );
          }}
        />
      </div>

      <DrawerSubmitAction
        submitText={
          isLoadingCreateDevice || isLoadingUpdateDevice ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : id ? (
            'Save Changes'
          ) : (
            'Add Device'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="deviceForm"
      />
    </form>
  );
};

export default DeviceForm;
