import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import useWindowDimensions from '@/utils/hooks/useWindowDimension';
import { TModalProps } from '@/types/modal';
import { cn } from '@/lib/utils';

const Modal = ({
  isShown = true,
  toggle,
  children,
  title,
  description,
  minWidth,
  maxWidth,
  onInteractOutsideDialogContent,
}: TModalProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (isDesktop) {
    return (
      <Dialog open={isShown} onOpenChange={toggle}>
        <DialogContent
          onInteractOutside={onInteractOutsideDialogContent}
          className={cn(
            minWidth ?? 'min-w-[450px]',
            maxWidth ?? 'bg-rs-v2-navy-blue sm:max-w-[425px]',
          )}
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
  }

  return (
    <Drawer open={isShown} onOpenChange={toggle}>
      <DrawerContent className="bg-rs-v2-navy-blue">
        <DrawerHeader className="text-left">
          <DrawerTitle className="mb-4">{title}</DrawerTitle>
          {description ? (
            <DrawerDescription className="text-white">
              {description}
            </DrawerDescription>
          ) : null}
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default Modal;
