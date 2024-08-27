import { cn } from '@/lib/utils';

type Props = {
  /**
   * @description in Pixels
   */
  size?: number;
  /**
   * @description in Pixels
   */
  borderWidth?: number;
  isFullWidthAndHeight?: boolean;
  className?: string;
  containerClassName?: string;
};

const Spinner = ({
  size,
  isFullWidthAndHeight = true,
  containerClassName,
  className,
  borderWidth,
}: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        isFullWidthAndHeight && 'h-screen w-full',
        containerClassName,
      )}
      data-testid="loading-spinner"
    >
      <span
        className={cn(
          'box-border inline-block animate-spin rounded-[50%] border-solid border-rs-v2-mint border-b-transparent',
          size ? `w-[${size}px]` : 'w-[48px]',
          size ? `h-[${size}px]` : 'h-[48px]',
          borderWidth ? `border-[${borderWidth.toString()}px]` : 'border-[5px]',
          className,
        )}
      />
    </div>
  );
};

export default Spinner;
