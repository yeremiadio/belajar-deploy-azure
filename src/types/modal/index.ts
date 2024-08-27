import { ReactNode } from 'react';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;
type FocusOutsideEvent = CustomEvent<{
  originalEvent: FocusEvent;
}>;
export type TModalProps = {
  toggle: (open?: boolean) => void;
  isShown: boolean;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  minWidth?: string;
  maxWidth?: string;
  onInteractOutsideDialogContent?: ((event: PointerDownOutsideEvent | FocusOutsideEvent) => void)
};

export type TModalFormProps<TData> = Pick<TModalProps, 'toggle'> & {
  isEditing?: boolean;
  data?: TData;
  id?: number;
};
