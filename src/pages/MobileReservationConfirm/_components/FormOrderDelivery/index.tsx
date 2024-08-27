import { FC, useRef, useState } from 'react';
import { Control, Controller, FormState } from 'react-hook-form';
import { MdClose } from 'react-icons/md';

import SelectComponent from '@/components/Select';
import { Button } from '@/components/ui/button';
import {
  DeliveryStatusEnum,
  TOrderDeliveryRequestFormObject,
} from '@/types/api/order/orderDelivery';
import { BasicSelectOpt } from '@/types/global';

interface Props {
  control: Control<TOrderDeliveryRequestFormObject>;
  formState: FormState<TOrderDeliveryRequestFormObject>;
}

export const FormOrderDelivery: FC<Props> = ({ control, formState }) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Controller
        name="status"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => {
          return (
            <SelectComponent
              label="Status Delivery"
              placeholder="Select Status Delivery"
              options={
                [
                  {
                    label: DeliveryStatusEnum.DELIVERED,
                    value: DeliveryStatusEnum.DELIVERED,
                  },
                  {
                    label: DeliveryStatusEnum.CONFIRMED,
                    value: DeliveryStatusEnum.CONFIRMED,
                  },
                  {
                    label: DeliveryStatusEnum.NOT_RECEIVED.replace('_', ''),
                    value: DeliveryStatusEnum.NOT_RECEIVED,
                  },
                ] as BasicSelectOpt<string>[]
              }
              loading={false}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              required
              errorMessage={error?.message}
            />
          );
        }}
      />

      <Controller
        name="file"
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="flex flex-col">
            <span className="text-nowrap pb-2">Upload Proof</span>
            <div className="inline-flex items-center">
              <Button
                type="button"
                className="group border border-rs-v2-mint bg-transparent hover:bg-rs-v2-mint/80"
                role="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <span className="text-rs-v2-mint group-hover:text-white">
                  Browse
                </span>
              </Button>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept=".doc,.docx,.xls,.xlsx,.png,.jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      // file size > 10MB
                      alert(
                        'File is too large, please select a file less than 10MB.',
                      );
                      return;
                    }
                    const acceptedFileTypes = [
                      'doc',
                      'docx',
                      'xls',
                      'xlsx',
                      'png',
                      'jpg',
                    ];
                    const fileType = file.name.split('.').pop()?.toLowerCase();
                    if (!fileType || !acceptedFileTypes.includes(fileType)) {
                      alert(
                        'Invalid file type. Only .doc, .docx, .xls, .xlsx, .png, .jpg files are accepted.',
                      );
                      return;
                    }
                    onChange(file);
                    setFileName(file.name || '');
                  }
                }}
              />
              {fileName && (
                <div className="ml-2 flex flex-row items-center">
                  <span className="text-xs">
                    {fileName.length > 30
                      ? fileName.slice(0, 30) + '...'
                      : fileName}
                  </span>
                  <MdClose
                    size={20}
                    className="cursor-pointer text-red-500"
                    onClick={() => {
                      setFileName('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      onChange(undefined);
                      formState.errors.file = {
                        type: 'required',
                        message: 'File is required',
                      };
                    }}
                  />
                </div>
              )}
            </div>
            <p className="pt-2 text-xs text-red-500">{error?.message}</p>
          </div>
        )}
      />
    </>
  );
};
