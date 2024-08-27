import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        Icon,
        blurColor,
        ...props
      }) {
        return (
          <Toast key={id} {...props}>
            {Icon ? (
              <div className="flex items-center gap-3">
                <div className="relative flex-1 rounded-full shadow-lg shadow-rs-v2-shadow-blue">
                  <Icon />
                  <span
                    className={cn(
                      'absolute left-[-49px] top-[53px] block h-[10rem] w-[10rem] rounded-full blur-[72px]',
                      blurColor,
                    )}
                  />
                </div>
                <div className="grid">
                  {title && (
                    <ToastTitle className="text-white">{title}</ToastTitle>
                  )}
                  {description && (
                    <ToastDescription className="text-white">
                      {description}
                    </ToastDescription>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid">
                {title && (
                  <ToastTitle className="text-white">{title}</ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-white">
                    {description}
                  </ToastDescription>
                )}
              </div>
            )}
            {action}
            <ToastClose className="text-white hover:text-white" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
