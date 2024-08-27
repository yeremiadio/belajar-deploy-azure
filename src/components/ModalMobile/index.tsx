import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { TModalProps } from '@/types/modal';
import { cn } from '@/lib/utils';
import useWindowDimensions from '@/utils/hooks/useWindowDimension';

export const ModalMobile = ({
  isShown = true,
  toggle,
  children,
  title,
  description,
  onInteractOutsideDialogContent,
}: TModalProps) => {
  const { width } = useWindowDimensions();
  const isMobile = width <= 480;

  return (
    <Dialog open={isShown} onOpenChange={toggle}>
      <DialogContent
        onInteractOutside={onInteractOutsideDialogContent}
        className={cn(isMobile && 'w-[90%] rounded-xl')}
      >
        <DialogHeader>
          <DialogTitle className="mb-4">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-white">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
