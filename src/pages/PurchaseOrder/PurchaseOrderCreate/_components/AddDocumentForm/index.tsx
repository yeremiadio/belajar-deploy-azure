import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdClose } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import { TModalFormProps } from '@/types/modal';
import { TOrderDocumentRequestFormObject } from '@/types/api/order/orderDocument';
import { ErrorMessageBackendDataShape } from '@/types/api';

import documentOrderValidationSchema from '@/utils/validations/order/documentOrderValidationSchema';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

import InputComponent from '@/components/InputComponent';
import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { usePostOrderFilesMutation } from '@/stores/purchaseOrderStore/orderFileApi';

const AddDocumentForm = ({ toggle }: TModalFormProps<any>) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();
  const [postOrderFiles] = usePostOrderFilesMutation();
  const orderId = Number(searchParams.get('id'));

  const DocumentForm = useForm<TOrderDocumentRequestFormObject>({
    defaultValues: {
      label: '',
      annotation: '',
      file: undefined,
    },
    resolver: yupResolver(documentOrderValidationSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { control } = DocumentForm;
  const { toast } = useToast();

  const handleSubmit = (data: TOrderDocumentRequestFormObject) => {
    postOrderFiles({ ...data, orderId })
      .unwrap()
      .then(() => {
        toggle();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Document created successfully',
            variant: 'success',
          }),
        );
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        const { title, message } = generateStatusCodesMessage(error.status);
        toast(
          generateDynamicToastMessage({
            title,
            description: `${message} "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  };

  return (
    <form
      id="orderDocumentForm"
      className="flex w-full flex-col gap-4"
      onSubmit={DocumentForm.handleSubmit(handleSubmit)}
    >
      <Controller
        name="label"
        control={control}
        render={({
          field: { onChange, value, onBlur },
          fieldState: { error },
        }) => (
          <InputComponent
            label="Document Label"
            placeholder="Document Label"
            type="text"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        name="annotation"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <InputComponent
            label="Annotation"
            placeholder="Annotation"
            onBlur={onBlur}
            type="text"
            value={value}
            required
            onChange={onChange}
          />
        )}
      />
      <Controller
        name="file"
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="flex flex-col">
            <span className="text-nowrap pb-2">
              File<span className="text-red-500">*</span>
            </span>
            <div className="inline-flex items-center">
              <Button
                type="button"
                className="btn-primary-mint hover:hover-btn-primary-mint w-10"
                role="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                Select File
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
                      DocumentForm.formState.errors.file = {
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

      <DrawerSubmitAction
        type="submit"
        form="orderDocumentForm"
        disabled={
          DocumentForm.formState.isSubmitting || !DocumentForm.formState.isValid
        }
        toggle={toggle}
        submitText="Add Document"
      />
    </form>
  );
};

export default AddDocumentForm;
