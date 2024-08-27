import {
  Button,
  ButtonProps as ShadcnUiButtonProps,
} from '@/components/ui/button';
import { DrawerFooter } from '@/components/ui/drawer';
import { TModalProps } from '@/types/modal';
import { ReactNode } from 'react';
// import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface ButtonProps extends Partial<ShadcnUiButtonProps> {
  submitText: ReactNode | string;
  cancelText?: ReactNode | string;
}

const DrawerSubmitAction = ({
  toggle,
  cancelText,
  submitText,
  ...rest
}: Pick<TModalProps, 'toggle'> & ButtonProps) => {
  return (
    <DrawerFooter className="mt-2 flex flex-row justify-end gap-4 pb-0 pr-0 pt-2">
      <Button
        type="button"
        onClick={() => toggle()}
        className="btn-terinary-gray hover:hover-btn-terinary-gray"
      >
        {cancelText ? cancelText : 'Cancel'}
      </Button>
      <Button
        type="submit"
        className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue disabled:disabled-btn-disabled-slate-blue"
        {...rest}
        role="button"
      >
        {submitText}
      </Button>
    </DrawerFooter>
  );
};

export default DrawerSubmitAction;
