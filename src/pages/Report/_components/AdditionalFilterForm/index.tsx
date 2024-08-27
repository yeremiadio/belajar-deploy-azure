import { FC, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import SelectComponent from '@/components/Select';

import { EAvailableAdditionalFilterReport } from '@/types/api/report';

import FilterComboboxDropdown from '../FilterComboboxDropdown';

export type TAdditionalFilterForm = {
  filters: {
    filterType: string;
    filterValue: string[];
  }[];
};

type Props = {
  toggle: (val?: boolean) => void;
  setFilter: (val: TAdditionalFilterForm) => void;
  activeFilter?: TAdditionalFilterForm;
  deviceListOptions?: { label: string; value: string }[];
  filterTypeOptions?: { label: string; value: string }[];
  alertStatusOptions?: { label: string; value: string }[];
  alertConfirmedOptions?: { label: string; value: string }[];
  sensorListOptions?: { label: string; value: string }[];
  showAlertConfirmed?: boolean;
};

const AdditionalFilterForm: FC<Props> = ({
  toggle,
  setFilter,
  activeFilter,
  deviceListOptions,
  filterTypeOptions,
  alertStatusOptions,
  alertConfirmedOptions,
  sensorListOptions,
  showAlertConfirmed,
}) => {
  const maxFilter = showAlertConfirmed
    ? Object.keys(EAvailableAdditionalFilterReport).length
    : Object.keys(EAvailableAdditionalFilterReport).length - 1;

  const form = useForm<TAdditionalFilterForm>({
    defaultValues:
      activeFilter?.filters?.length === 0
        ? {
            filters: [
              {
                filterType: '',
                filterValue: [],
              },
            ],
          }
        : {
            filters:
              (activeFilter?.filters?.length ?? 0) === maxFilter
                ? activeFilter?.filters
                : activeFilter?.filters?.concat([
                    {
                      filterType: '',
                      filterValue: [],
                    },
                  ]),
          },
  });

  const filtersWatch = useWatch({
    control: form.control,
    name: 'filters',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'filters',
  });

  const lastFilter = filtersWatch[filtersWatch.length - 1];

  useEffect(() => {
    if (
      lastFilter?.filterType !== '' &&
      lastFilter?.filterValue?.length !== 0 &&
      filtersWatch.length < maxFilter
    ) {
      append({
        filterType: '',
        filterValue: [],
      });
    }
  }, [lastFilter]);

  const handleSubmit = form.handleSubmit((data) => {
    const sanitizedData = data.filters.filter(
      (filter) => filter.filterType !== '' && filter.filterValue.length > 0,
    );

    setFilter({ filters: sanitizedData });
    toggle();
  });

  const handleClearFilter = () => {
    form.reset({
      filters: [
        {
          filterType: '',
          filterValue: [],
        },
      ],
    });
  };

  return (
    <form
      id="additionalFilterForm"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-5 md:p-0"
    >
      {fields.map((field, index) => {
        const showRemoveButton = index !== fields.length - 1;

        const filterType = filtersWatch[index]?.filterType;
        let valueOptions: {
          label: string;
          value: string;
        }[] = [];

        switch (filterType) {
          case 'deviceIds':
            valueOptions = deviceListOptions ? deviceListOptions : [];
            break;
          case 'sensorTypeIds':
            valueOptions = sensorListOptions ? sensorListOptions : [];
            break;
          case 'threatLevels':
            valueOptions = alertStatusOptions ? alertStatusOptions : [];
            break;
          case 'alertConfirmed':
            valueOptions = alertConfirmedOptions ? alertConfirmedOptions : [];
            break;
        }

        const filteredFilterTypeOptions = filterTypeOptions?.filter(
          (option) => {
            const isSelected = filtersWatch.some(
              (filter) => filter.filterType === option.value,
            );
            const isAlertConfirmed = option.value === 'alertConfirmed';

            return (
              (!isSelected || filterType === option.value) &&
              (showAlertConfirmed || !isAlertConfirmed)
            );
          },
        );

        const useSingleSelect = filterType === 'alertConfirmed';

        return (
          <div className="flex gap-3" key={field.id}>
            <div className="grid w-full grid-cols-2 gap-3">
              <Controller
                control={form.control}
                name={`filters.${index}.filterType`}
                render={({ field: { value, onChange } }) => (
                  <SelectComponent
                    value={value === '' ? undefined : value}
                    onChange={onChange}
                    placeholder="Choose Filter"
                    options={filteredFilterTypeOptions}
                  />
                )}
              />
              <Controller
                control={form.control}
                name={`filters.${index}.filterValue`}
                render={({ field: { value, onChange } }) => {
                  const selectedLabel = value?.map((item) => {
                    return valueOptions?.find((option) => option.value === item)
                      ?.label;
                  });

                  const selectedLabelText = selectedLabel?.join(', ');

                  return (
                    <FilterComboboxDropdown
                      title={selectedLabelText}
                      singleSelect={useSingleSelect}
                      fullWidth
                      className="h-full w-full max-w-full border-rs-v2-galaxy-blue bg-rs-v2-galaxy-blue text-white hover:border-rs-v2-mint [&>svg]:text-[16px]"
                      drawerClassName="top-[44px]"
                      placeholder="Choose Value"
                      selectedOption={value}
                      options={valueOptions}
                      onChange={(newValue) => {
                        onChange(newValue);
                      }}
                      withSelectAll
                    />
                  );
                }}
              />
            </div>

            {fields.length > 1 ? (
              showRemoveButton ? (
                <button
                  className="mx-2"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <MdClose size={18} className="text-rs-v2-red" />
                </button>
              ) : (
                <div className="mx-2 text-transparent">
                  <MdClose size={18} />
                </div>
              )
            ) : null}
          </div>
        );
      })}
      <div className="flex items-center justify-between">
        <button
          className="mt-4 text-sm text-rs-v2-red"
          onClick={handleClearFilter}
          type="button"
        >
          Clear Filter
        </button>
        <DrawerSubmitAction
          submitText="Apply"
          toggle={toggle}
          form="additionalFilterForm"
        />
      </div>
    </form>
  );
};

export default AdditionalFilterForm;
