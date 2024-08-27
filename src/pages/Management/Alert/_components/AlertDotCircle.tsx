import { cn } from '@/lib/utils';
import { IAlert } from '@/types/api/management/alert';

type Props = Pick<IAlert, 'threatlevel'> & {
  isShowLabel?: boolean;
};

const AlertDotCircle = ({ threatlevel, isShowLabel = false }: Props) => {
  const switchAlertDotLabelAndColor = (): {
    dotColor: string;
    label: string;
  } => {
    const defaultNormalAlertColor = 'bg-rs-alert-normal';
    const defaultNormalAlertLabel = 'Normal';
    if (!threatlevel)
      return {
        label: defaultNormalAlertLabel,
        dotColor: defaultNormalAlertColor,
      };
    switch (threatlevel) {
      case 1:
        return {
          label: 'Warning',
          dotColor: 'bg-rs-alert-warning',
        };
      case 2:
        return {
          label: 'Critical',
          dotColor: 'bg-rs-alert-danger',
        };
      default:
        return {
          label: defaultNormalAlertLabel,
          dotColor: defaultNormalAlertColor,
        };
    }
  };

  return (
    <div
      className={cn(
        isShowLabel ? 'flex flex-row items-center gap-6' : undefined,
      )}
    >
      <div
        title={`Threat level ${threatlevel}`}
        className={cn(
          'relative inline-block h-[1.25rem] w-[1.25rem] translate-x-3/4 translate-y-[15%] transform rounded-full',
          switchAlertDotLabelAndColor().dotColor,
        )}
      />
      {isShowLabel ? (
        <p className="mt-1">{switchAlertDotLabelAndColor().label}</p>
      ) : null}
    </div>
  );
};

export default AlertDotCircle;
