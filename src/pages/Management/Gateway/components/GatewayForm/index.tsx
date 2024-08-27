import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SelectComponent from '@/components/Select';
import Spinner from '@/components/Spinner';
import { useToast } from '@/components/ui/use-toast';
import { SelectLoading } from '@/components/Select/SelectLoading';

import {
  useCreateGatewayMutation,
  useUpdateGatewayMutation,
} from '@/stores/managementStore/gatewayStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import {
  IGateway,
  TGatewayRequestFormObject,
} from '@/types/api/management/gateway';
import { TModalFormProps } from '@/types/modal';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import useLocationOpts from '@/utils/hooks/selectOptions/useLocationOptions';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import gatewayValidationSchema from '@/utils/validations/management/gateway/gatewayValidationSchema';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useGatewayThemeByCompanyOpts from '@/utils/hooks/selectOptions/useGatewayThemeByCompanyOptions';

type Props<TData> = TModalFormProps<TData>;

const GatewayForm: FC<Props<IGateway>> = ({ toggle, isEditing, data }) => {
  const { toast } = useToast();
  const [searchLocation, setSearchLocation] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    watch,
    resetField,
  } = useForm<TGatewayRequestFormObject>({
    defaultValues: {
      name: data?.name || undefined,
      moduleId: data?.module?.id ?? undefined,
      companyId: data?.company?.id ?? undefined,
      locationId: data?.location?.id ?? undefined,
    },
    resolver: yupResolver(gatewayValidationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    resetField('locationId', undefined);
    resetField('moduleId', undefined);
  }, [watch('companyId')]);

  const { arr: moduleOpts, isLoading: isLoadingModuleOpts } =
    useGatewayThemeByCompanyOpts(
      { id: watch('companyId') },
      { skip: !watch('companyId') },
    );

  const { arr: companyOpts, isLoading: isLoadingCompanyOpts } = useCompanyOpts({
    isPaginated: false,
  });

  const {
    page: pageLocationOptions,
    take: takeLocationOptions,
    setLimit: setLimitLocationOption,
  } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  const {
    arr: locationOpts,
    isLoading: isLoadingLocationOpts,
    meta: metaLocationOptions,
  } = useLocationOpts(
    removeEmptyObjects({
      companyId: watch('companyId'),
      page: pageLocationOptions,
      take: takeLocationOptions,
      search: searchLocation,
      isPaginated: false,
    }),
    {
      skip: !watch('companyId'),
    },
  );

  const [createGateway, { isLoading: isLoadingCreateGateway }] =
    useCreateGatewayMutation();
  const [updateGateway, { isLoading: isLoadingUpdateGateway }] =
    useUpdateGatewayMutation();

  const handleLocationOptsLoadMore = () => {
    setLimitLocationOption((prev) => prev + 10);
  };

  const handleOnSearchLocation = (val: string) => {
    setSearchLocation(val);
  };

  const handleSubmitData = async (formData: TGatewayRequestFormObject) => {
    const finalFormData: TGatewayRequestFormObject = {
      name: formData.name,
      moduleId: Number(formData.moduleId),
      companyId: Number(formData.companyId),
      locationId: Number(formData.locationId),
    };

    if (isEditing) {
      if (!data?.id) return;
      await updateGateway({ id: data?.id, data: finalFormData })
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Gateway updated successfully',
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
          // toast(
          //   generateDynamicToastMessage({
          //     title: 'Error',
          //     description: `Failed to update Gateway\n${error?.data?.message ?? ''}`,
          //     variant: 'error',
          //   }),
          // );
        });
    } else {
      await createGateway(finalFormData)
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Gateway created successfully',
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
        });
    }
  };

  return (
    <form
      id="gatewayForm"
      onSubmit={handleSubmit(handleSubmitData)}
      className="grid grid-cols-1 gap-4"
    >
      <Controller
        name="companyId"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => {
          return (
            <SelectComponent
              label="Company"
              placeholder="Select Company"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              required
              loading={isLoadingCompanyOpts}
              options={companyOpts}
            />
          );
        }}
      />
      <Controller
        name="locationId"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => {
          return (
            <SelectComponent
              label="Location"
              placeholder="Select Location"
              onChange={onChange}
              onBlur={onBlur}
              onSearch={handleOnSearchLocation}
              value={value}
              required
              loading={isLoadingLocationOpts}
              disabled={!watch('companyId')}
              options={[
                ...locationOpts,
                {
                  label: (
                    <SelectLoading
                      meta={metaLocationOptions}
                      onLoad={handleLocationOptsLoadMore}
                    />
                  ),
                  value: 'loading',
                },
              ]}
            />
          );
        }}
      />
      <Controller
        name="moduleId"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => {
          return (
            <SelectComponent
              label="Gateway Theme"
              placeholder="Select Gateway Theme"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              required
              loading={isLoadingModuleOpts}
              options={moduleOpts}
              disabled={!watch('companyId')}
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
              label="Gateway Name"
              placeholder="Gateway Name"
              onChange={onChange}
              onBlur={onBlur}
              required
              value={value}
              errorMessage={error?.message}
            />
          );
        }}
      />

      <DrawerSubmitAction
        submitText={
          isLoadingCreateGateway || isLoadingUpdateGateway ? (
            <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Add Gateway'
          )
        }
        disabled={!isDirty || !isValid}
        toggle={toggle}
        form="gatewayForm"
      />
    </form>
  );
};

export default GatewayForm;
