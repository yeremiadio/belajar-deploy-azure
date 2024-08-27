import { FC } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';

import InputComponent from '@/components/InputComponent';
import {
  TReservationActivityFormObject,
  TReservationItem,
} from '@/types/api/reservation';

interface Props {
  data: TReservationItem[];
  control: Control<TReservationActivityFormObject>;
}

export const FormInventory: FC<Props> = ({ data, control }) => {
  const { fields } = useFieldArray({
    control,
    name: 'reservationItems',
  });
  return (
    <>
      <table className="w-full table-auto border-separate border-spacing-0 rounded-md border border-solid border-rs-v2-gunmetal-blue">
        <thead className="bg-rs-v2-navy-blue text-left">
          <tr>
            <th className="min-w-[200px] p-2">Inventory</th>
            <th className="border-l border-solid border-rs-v2-gunmetal-blue p-2 text-left">
              Qty
            </th>
            <th className="border-l border-solid border-rs-v2-gunmetal-blue p-2 text-left">
              Actual <span className="text-red-500">*</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr className="table-row bg-rs-v2-galaxy-blue" key={field.id}>
              <td className="border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                {data[index].inventory.name ?? '-'}
              </td>
              <td className="border-l border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                {data[index].amount && data[index].inventory
                  ? `${data[index].amount} ${data[index].inventory.unit}`
                  : '-'}
              </td>
              <td className="inline-flex items-center gap-2 border-l border-t border-solid border-rs-v2-gunmetal-blue p-2 text-left">
                <Controller
                  name={`reservationItems.${index}.actualAmount`}
                  control={control}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => (
                    <InputComponent
                      value={value}
                      type="number"
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="Actual"
                      inputStyle="bg-rs-v2-navy-blue h-[39px] w-28 focus-visible:ring-0 focus-visible:ring-offset-0 hover:enabled:border-rs-v2-mint focus:enabled:border-rs-v2-mint  active:enabled:border-rs-v2-mint disabled:border-rs-v2-slate-blue disabled:bg-rs-v2-slate-blue disabled:text-rs-v2-gunmetal-blue disabled:opacity-100 placeholder:disabled:text-rs-v2-gunmetal-blue"
                      errorMessage={error?.message}
                    />
                  )}
                />
                <span>{data[index].inventory.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex flex-col gap-1">
        {data?.map((item) => (
          <i className="text-xs font-bold text-rs-alert-warning ">
            {item?.inventory &&
              `${item?.inventory?.name} stock available only ${item?.inventory?.stock} ${item?.inventory?.unit}.`}
          </i>
        ))}
      </div>
    </>
  );
};
