import { ToasterToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { IconType } from 'react-icons';
import { MdCancel } from 'react-icons/md';
import { RiCheckboxCircleFill } from 'react-icons/ri';

type TToastVariant = 'success' | 'error';

type ToastProps = {
  title: string;
  description: string;
  variant: TToastVariant;
  Icon?: IconType;
};

const defaultIconSize = 24;

const generateDynamicToastMessage = ({
  title,
  description,
  Icon,
  variant,
}: ToastProps): Omit<ToasterToast, 'id'> => {
  switch (variant) {
    case 'success':
      return {
        title,
        description,
        variant: 'default',
        className: cn(
          'toast-top-right',
          'border-b-[3px] border-solid bg-rs-v2-dark-toast-background',
          'border-b-rs-v2-green-toast',
        ),
        blurColor: cn('bg-rs-v2-green-toast'),
        Icon: () => (
          <RiCheckboxCircleFill color="#00DF80" size={defaultIconSize} />
        ),
      };
    case 'error':
      return {
        title,
        description,
        variant: 'default',
        className: cn(
          'toast-top-right',
          'border-b-[3px] border-solid bg-rs-v2-dark-toast-background',
          'border-b-rs-v2-red-warning',
        ),
        blurColor: cn('bg-rs-v2-red-warning'),
        Icon: () => <MdCancel color="#F44336" size={defaultIconSize} />,
      };

    default:
      return {
        title,
        description,
        variant: 'default',
        className: 'toast-top-right',
        Icon,
      };
  }
};

export default generateDynamicToastMessage;
