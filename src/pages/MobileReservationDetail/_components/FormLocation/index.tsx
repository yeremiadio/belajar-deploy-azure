import { FC, useMemo } from 'react';
import {
  Control,
  Controller,
  UseFormResetField,
  useWatch,
} from 'react-hook-form';

import SelectComponent from '@/components/Select';
import { TReservationActivityFormObject } from '@/types/api/reservation';
import { useDockOpts } from '@/utils/hooks/selectOptions/useDockOptions';
import { useWarehouseOpts } from '@/utils/hooks/selectOptions/useWarehouseOptions';
import { useGetPermissionByJwtQuery } from '@/stores/managementStore/userStore';
import { IUserGateway } from '@/types/api/user';

interface Props {
  control: Control<TReservationActivityFormObject>;
  resetField: UseFormResetField<TReservationActivityFormObject>;
}

export const FormLocation: FC<Props> = ({ control, resetField }) => {
  const values = useWatch({ control });

  // gatewayId yard
  const { data: permission } = useGetPermissionByJwtQuery();
  const gatewayYardMemo: IUserGateway | undefined = useMemo(() => {
    if (
      !permission ||
      !permission.permissions ||
      !permission.permissions.dashboard
    )
      return undefined;

    const { dashboard } = permission.permissions;
    const yardDashboard = dashboard.find((item) => item.name === 'yard');
    if (!yardDashboard) return undefined;

    const data = yardDashboard.gateway[0];
    return data;
  }, [permission]);

  // options
  const { arr: warehouseOpts, isLoading: isLoadingWarehouse } =
    useWarehouseOpts(
      { gatewayId: gatewayYardMemo?.id ?? 0 },
      { skip: !gatewayYardMemo?.id },
    ); //add skip when gatewayId not exist [SOON]

  const { arr: dockOpts, isLoading: isLoadingDock } = useDockOpts(
    {
      gatewayId: gatewayYardMemo?.id ?? 0,
      warehouseId: values.warehouseId ?? 0,
    },
    { skip: !gatewayYardMemo?.id || !values.warehouseId },
  );

  return (
    <>
      <Controller
        name="warehouseId"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              label="Warehouse"
              placeholder="Select Warehouse"
              options={warehouseOpts}
              loading={isLoadingWarehouse}
              onChange={(value, option) => {
                onChange(value, option);
                resetField('dockId', undefined);
              }}
              onBlur={onBlur}
              value={value}
              required
              errorMessage={error?.message}
              containerClassName={'flex'}
              labelClassName={'w-[120px]'}
            />
          );
        }}
      />

      <Controller
        name="dockId"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              label="Dock"
              placeholder="Select Dock"
              options={dockOpts}
              loading={isLoadingDock}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              required
              errorMessage={error?.message}
              containerClassName={'flex'}
              labelClassName={'w-[120px]'}
              disabled={!values.warehouseId}
            />
          );
        }}
      />
    </>
  );
};
