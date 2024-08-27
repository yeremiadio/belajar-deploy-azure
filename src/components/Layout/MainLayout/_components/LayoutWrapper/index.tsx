import { AlertNotification } from '@/components/AlertNotification';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
};

export default function LayoutWrapper({
  children,
  className,
  ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...rest}>
      <AlertNotification />
      {children}
    </div>
  );
}
