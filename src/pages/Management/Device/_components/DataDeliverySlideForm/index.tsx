import { useMemo } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

import { TModalProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

const DataDeliverySlideForm = ({
  toggle: toggleAdjustDataDelivery,
}: Pick<TModalProps, 'toggle'>) => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const dataDeliveryDurationParams = searchParams.get('dataDeliveryDuration');
  const { control, handleSubmit } = useForm<{ duration: number[] }>({
    defaultValues: {
      duration: [
        dataDeliveryDurationParams ? Number(dataDeliveryDurationParams) : 1,
      ],
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const { duration: adjustDataDelivery } = useWatch({ control });

  /**
   * @todo REFACTOR THIS SOON
   */
  const timeTextString = useMemo(() => {
    if (!adjustDataDelivery) return '0 Sec';
    const duration = adjustDataDelivery[0];
    let value = 0;
    if (duration > 4) {
      value = 60 + (duration - 5) * 30; // Add 30 seconds for each value above 5
    } else if (duration === 4) {
      value = duration * 7.5;
    } else {
      value = duration * 5;
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    if (minutes === 0) {
      return `${seconds} Sec`;
    } else {
      return `${minutes} Min ${seconds} Sec`;
    }
  }, [adjustDataDelivery]);

  const handleSubmitItem: SubmitHandler<{ duration: number[] }> = async (
    _,
    event,
  ) => {
    event?.preventDefault();
    if (adjustDataDelivery) {
      searchParams.set('dataDeliveryDuration', `${adjustDataDelivery[0]}`);
      setSearchParams(searchParams);
    }
    toggleAdjustDataDelivery();
    toast(
      generateDynamicToastMessage({
        title: 'Success',
        description: `Data delivery created successfully. Duration ${timeTextString}`,
        variant: 'success',
      }),
    );
  };

  return (
    <form id="dataDeliveryForm" onSubmit={handleSubmit(handleSubmitItem)}>
      <div className={cn('grid w-full items-center gap-2')}>
        <Label
          htmlFor="interval-time"
          className="flex items-center justify-between"
        >
          <p className="text-sm text-white">Interval Time</p>
          <p className="bg-rs-v2-slate-blue-60% px-3 py-2">{timeTextString}</p>
        </Label>

        <div className="flex">
          <Controller
            name="duration"
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Slider
                  max={23}
                  min={1}
                  value={value}
                  onValueChange={onChange}
                  step={1}
                  id="interval-time"
                  className={cn('col-span-11 w-full')}
                />
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs">5 Sec</div>
          <div className="text-xs">10 Min</div>
        </div>
        <DrawerSubmitAction
          submitText={'Save'}
          toggle={toggleAdjustDataDelivery}
          form="dataDeliveryForm"
        />
      </div>
    </form>
  );
};

export default DataDeliverySlideForm;
