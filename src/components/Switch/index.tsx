import { FC } from 'react';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  value: boolean;
  disabled?: boolean;
  id?: string;
  defaultChecked?: boolean;
  onCheckedChange: (value: boolean) => void;
  label?: string;
  className?: string | undefined;
}

const SwitchComponent: FC<Props> = ({
  value,
  id,
  onCheckedChange,
  label,
  defaultChecked,
  disabled,
  className,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={id}
        className={cn(
          "data-[state=checked]:bg-rs-v2-mint",
          className
        )}
        checked={value}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      {label && <Label htmlFor={id}>{label}</Label>}
    </div>
  );
};

export default SwitchComponent;
