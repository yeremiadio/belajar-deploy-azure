import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm, useWatch } from 'react-hook-form';

import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { toast } from '@/components/ui/use-toast';

import { useBindAccountDeviceMutation } from '@/stores/managementStore/deviceStore/deviceStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IBindAccountDeviceRequestFormObject,
  IDeviceDetailSublocationMachineWithMap,
  TBindAccountDeviceRequestFormObject,
} from '@/types/api/management/device';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import isFieldRequired from '@/utils/functions/isFieldRequired';
import useUserType from '@/utils/hooks/auth/useUserType';
import useUserOpts from '@/utils/hooks/selectOptions/useUserListOptions';
import bindAccountDeviceValidationSchema from '@/utils/validations/management/device/bindAccountDeviceValidationSchema';

    

const BindAccountForm = ({
  data,
  toggle,
  isEditing,
}:  TModalFormProps<IDeviceDetailSublocationMachineWithMap>) => {
  const {
    control,
    formState: { isDirty, isValid },
  } = useForm<TBindAccountDeviceRequestFormObject>({
    defaultValues: {
      userIds: isEditing ? data?.users.map((value) => value.id) : [],
    },
    resolver: yupResolver(bindAccountDeviceValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const isRequired = (
    fieldName: keyof TBindAccountDeviceRequestFormObject,
  ): boolean => {
    const value = isFieldRequired<TBindAccountDeviceRequestFormObject>(
      bindAccountDeviceValidationSchema,
      fieldName,
    );
    return value;
  };
  const values = useWatch({ control });

  const [bindAccountDevice, { isLoading: isLoadingBindAccountDevice }] =
    useBindAccountDeviceMutation();

  const userType = useUserType();

  const { arr: employeeOptions } = useUserOpts({
    isPaginated: false,
    companyId: userType === 'systemadmin' ? data?.companyId : undefined,
  }); 


  const handleSubmitData = async() => {
    if (!data || !data.id) return;
    const submitData: IBindAccountDeviceRequestFormObject = {
      userIds:  values?.userIds ? values?.userIds : []
    };
    await bindAccountDevice({ id: data.id, ...submitData })
      .unwrap()
      .then(() => {
        toggle();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Account binded successfully',
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
    <form id="bindAccountForm">
      <Controller
        name="userIds"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              mode="multiple"
              onChange={onChange}
              value={value}
              label="Account"
              required={isEditing? false: isRequired('userIds')}
              placeholder="Select Account"
              onBlur={onBlur}
              errorMessage={isEditing? "" : error?.message}
              isError={!!error?.message}
              options={employeeOptions}
            />
          );
        }}
      />
      <DrawerFooter className="flex flex-row justify-end gap-4 pt-4 pr-0 pb-0">
        <DrawerClose asChild>
          <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
            Cancel
          </Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button
            type="button"
            form="bindAccountForm"
            disabled={
              isEditing
                ? false
                : !isValid || !isDirty || isLoadingBindAccountDevice
            }
            onClick={handleSubmitData}
            className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue disabled:disabled-btn-disabled-slate-blue"
          >
            {isLoadingBindAccountDevice ? (
              <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Bind Account'
            )}
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
};

export default BindAccountForm;
