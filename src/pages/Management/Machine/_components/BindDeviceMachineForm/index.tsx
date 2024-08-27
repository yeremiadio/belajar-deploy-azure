import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { MdDelete } from 'react-icons/md';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import SelectComponent from '@/components/Select';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import { loadCookie } from '@/services/cookie';
import { useBindDeviceMachineMutation } from '@/stores/managementStore/machineStore/machineStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IBindDeviceMachineFormObject,
  IMachine,
  TBindDeviceMachineRequestFormObject,
} from '@/types/api/management/machine';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useDeviceListOpts from '@/utils/hooks/selectOptions/useDeviceListOptions';
import useGatewayOpts from '@/utils/hooks/selectOptions/useGatewayOptions';
import bindMachineValidationSchema from '@/utils/validations/management/machine/bindMachineValidationSchema';

type TModalBindRecipeFormProps = TModalFormProps<IMachine> & {
  toggleUnBindDevice: (open?: boolean) => void;
};
const BindDeviceMachineForm = ({
  toggleUnBindDevice,
  toggle,
  isEditing,
  data,
}: TModalBindRecipeFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<TBindDeviceMachineRequestFormObject>({
    defaultValues: {
      deviceId: isEditing ? data?.device.id : undefined,
      gatewayId: isEditing ? data?.gateway.id : undefined,
    },
    resolver: yupResolver(bindMachineValidationSchema),
    mode: 'all',
    reValidateMode: 'onSubmit',
  });

  const values = useWatch({ control });
  const [bindDevice, { isLoading: isLoadingBindDevice }] =
    useBindDeviceMachineMutation();

  const { arr: deviceOpts, isLoading: isLoadingDeviceOpts } = useDeviceListOpts(
    {
      companyId: Number(loadCookie('companyId')),
      gatewayId: values.gatewayId?.toString() ?? undefined,
    },
  );

  const { arr: gatewayOpts, isLoading: isLoadingGatewayOpts } = useGatewayOpts(
    { companyId: Number(loadCookie('companyId')), 
      isPaginated: false ,
      moduleId: 17 },
    {
      skip: !Number(loadCookie('companyId')),
    },
  );
  const isRequired = (
    fieldName: keyof TBindDeviceMachineRequestFormObject,
  ): boolean => {
    const value = isFieldRequired<TBindDeviceMachineRequestFormObject>(
      bindMachineValidationSchema,
      fieldName,
    );
    return value;
  };

  const handleSubmitData: SubmitHandler<
    TBindDeviceMachineRequestFormObject
  > = async (formData, event) => {
    event?.preventDefault();
    if (!data || !data.id) return;
    const submitData: IBindDeviceMachineFormObject = {
      deviceId: formData.deviceId ?? 0,
      gatewayId: formData.gatewayId ?? 0,
    };

    await bindDevice({ id: data.id, ...submitData })
      .unwrap()
      .then(() => {
        toggle();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Machine device binded successfully',
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
    <form
      className="gap-4 grid grid-cols-1"
      id="bindMachineForm"
      onSubmit={handleSubmit(handleSubmitData)}
    >
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1">
          <Controller
            name="gatewayId"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <SelectComponent
                  onChange={(val) => {
                    onChange(val);
                    setValue('deviceId', null);
                  }}
                  value={value}
                  label="Gateway"
                  required={isRequired('gatewayId')}
                  options={gatewayOpts}
                  placeholder="Select Gateway"
                  loading={isLoadingGatewayOpts}
                />
              );
            }}
          />
        </div>
        <div className="flex flex-1 justify-center items-center gap-2">
          <Controller
            name="deviceId"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <SelectComponent
                  onChange={onChange}
                  value={value}
                  label="Device"
                  required={isRequired('deviceId')}
                  options={deviceOpts}
                  placeholder="Select Device"
                  loading={isLoadingDeviceOpts || isLoadingGatewayOpts}
                  disabled={!values.gatewayId}
                />
              );
            }}
          />{' '}
          {isEditing ? (
            <Button
              title="Unbind Device"
              type="button"
              onClick={() => {
                toggleUnBindDevice();
                toggle();
              }}
              className={cn(
                'mt-6 w-9 bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white disabled:cursor-default disabled:text-transparent',
              )}
            >
              <MdDelete size={24} />
            </Button>
          ) : null}
        </div>
      </div>
      <DrawerSubmitAction
        submitText={isEditing ? 'Save Changes' : 'Bind Device'}
        disabled={!isValid || isLoadingBindDevice}
        toggle={toggle}
        form="bindMachineForm"
      />
    </form>
  );
};

export default BindDeviceMachineForm;
