import { Fragment } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import Checkbox from '@/components/Checkbox';
import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';

import isFieldRequired from '@/utils/functions/isFieldRequired';
import alertValidationSchema from '@/utils/validations/management/alert/alertValidationSchema';
import useSensortypeOptions from '@/utils/hooks/selectOptions/useSensortypeOptions';
import useAlertThresholdOptions from '@/utils/hooks/selectOptions/useAlertThresholdOptions';
import useAlertThreatOptions from '@/utils/hooks/selectOptions/useAlertThreatOptions';
import handleInputChangeNumberOnly from '@/utils/functions/handleInputNumberOnly';

import {
  IAlert,
  IAlertRequestObject,
  TAlertRequestFormObject,
} from '@/types/api/management/alert';
import { TModalFormProps } from '@/types/modal';
import { ErrorMessageBackendDataShape } from '@/types/api';

import {
  useCreateAlertMutation,
  useUpdateAlertMutation,
} from '@/stores/alertStore/alertStoreApi';

import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

const AlertForm = ({ data, toggle, isEditing }: TModalFormProps<IAlert>) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<TAlertRequestFormObject>({
    defaultValues: {
      name: data?.name ?? '',
      sensortypeId: data?.sensortypeId || undefined,
      sign: data?.sign || undefined,
      value: data?.value ?? 0,
      threatlevel: data?.threatlevel || undefined,
      status_email: data?.status_email === 1 ? true : false,
      status_whatsapp: data?.status_whatsapp === 1 ? true : false,
    },
    resolver: yupResolver(alertValidationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const [createAlert, { isLoading: isCreatingAlert }] =
    useCreateAlertMutation();

  const [updateAlert, { isLoading: isEditingAlert }] = useUpdateAlertMutation();
  const { arr: sensorOptions } = useSensortypeOptions({});
  const { arr: thresholdOptions } = useAlertThresholdOptions({
    thresholdNumber: 2,
  });
  const { toast } = useToast();
  const { arr: threatOptions } = useAlertThreatOptions();
  const isRequired = (fieldName: keyof TAlertRequestFormObject): boolean => {
    const value = isFieldRequired<TAlertRequestFormObject>(
      alertValidationSchema,
      fieldName,
    );
    return value;
  };
  const switchBooleanStatusToNumber = (status: boolean) => {
    switch (status) {
      case false:
        return 0;
      case true:
        return 1;
      default:
        return 0;
    }
  };
  const handleSubmitItem: SubmitHandler<TAlertRequestFormObject> = async (
    formData,
    event,
  ) => {
    event?.preventDefault();
    const baseFormData = {
      name: formData.name,
      sensortypeId: formData?.sensortypeId ?? null,
      sign: formData?.sign ?? null,
      value: formData?.value ?? null,
      threatlevel: formData?.threatlevel ?? null,
      status: 1,
      status_email: formData.status_email
        ? switchBooleanStatusToNumber(formData.status_email)
        : 0,
      status_whatsapp: formData.status_whatsapp
        ? switchBooleanStatusToNumber(formData.status_whatsapp)
        : 0,
    };
    if (isEditing) {
      if (!data?.id || !data) return;
      const formDataUpdate: Partial<IAlertRequestObject> = { ...baseFormData };
      await updateAlert({ id: data?.id, data: formDataUpdate })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Alert updated successfully',
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
    } else {
      const formDataCreate: IAlertRequestObject = {
        ...baseFormData,
      };
      await createAlert({ ...formDataCreate, status: 1 })
        .unwrap()
        .then(() => {
          toggle();
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Alert created successfully',
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
    }
  };
  return (
    <form id="alertForm" onSubmit={handleSubmit(handleSubmitItem)}>
      <Controller
        name="name"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <InputComponent
              label="Alert Name"
              placeholder="Alert Name"
              onChange={onChange}
              onBlur={onBlur}
              containerStyle="mb-3 gap-2 grid w-full"
              required={isRequired('name')}
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />
      <Controller
        name="sensortypeId"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              label="Sensor Type"
              required={isRequired('sensortypeId')}
              placeholder="Select Sign..."
              onBlur={onBlur}
              errorMessage={error?.message}
              isError={!!error?.message}
              options={sensorOptions}
            />
          );
        }}
      />
      <div className="my-3 grid grid-cols-2 gap-4">
        <Controller
          name="sign"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <SelectComponent
                onChange={onChange}
                value={value}
                label="Threshold"
                required={isRequired('sign')}
                placeholder="Select Sign..."
                onBlur={onBlur}
                errorMessage={error?.message}
                isError={!!error?.message}
                options={thresholdOptions}
              />
            );
          }}
        />
        <Controller
          name="value"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return (
              <InputComponent
                label="Value"
                placeholder="Threshold Value..."
                onChange={onChange}
                onBlur={onBlur}
                onInput={handleInputChangeNumberOnly}
                required={isRequired('value')}
                value={value}
                errorMessage={error?.message}
              />
            );
          }}
        />
      </div>
      <Controller
        name="threatlevel"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              onChange={onChange}
              value={value}
              label="Threat"
              required={isRequired('threatlevel')}
              placeholder="Select Threat Level..."
              onBlur={onBlur}
              errorMessage={error?.message}
              isError={!!error?.message}
              options={threatOptions}
            />
          );
        }}
      />
      <div className="mb-8 mt-3 inline-flex items-center gap-5">
        <Controller
          name="status_email"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Fragment>
                <Checkbox label="Email" onChange={onChange} checked={value} />
              </Fragment>
            );
          }}
        />
        <Controller
          name="status_whatsapp"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Checkbox label="Whatsapp" onChange={onChange} checked={value} />
            );
          }}
        />
      </div>
      <DrawerSubmitAction
        submitText={
          isCreatingAlert || isEditingAlert ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Alert'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="alertForm"
      />
    </form>
  );
};

export default AlertForm;
