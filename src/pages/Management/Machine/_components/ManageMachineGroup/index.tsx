import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { yupResolver } from '@hookform/resolvers/yup';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import InputComponent from '@/components/InputComponent';
import SwitchComponent from '@/components/Switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import {
  IMachine,
  IMachineGroup,
  TManageGroupMachineRequestFormObject,
} from '@/types/api/management/machine';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import manageMachineGroupValidationSchema from '@/utils/validations/management/machine/manageMachineGroupValidationSchema';
import {
  useCreateMachineGroupBulkMutation,
  useGetmachineGroupListQuery,
} from '@/stores/managementStore/machineStore/machineStoreApi';
import { useEffect } from 'react';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const ManageMachineGroupForm = ({ toggle }: TModalFormProps<IMachine>) => {
  const { toast } = useToast();
  const { data: machineGroupData, isLoading } = useGetmachineGroupListQuery({});
  // const [manageGroup, {isLoading: isLoadingManageGroup}] = useManage

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      machineGroups: [],
    },
    resolver: yupResolver(manageMachineGroupValidationSchema),
  });
  const {
    fields,
    append: appendFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control,
    name: 'machineGroups',
  });
  const [createMachineGroup, { isLoading: isLoadingCreateMachineGroup }] =
    useCreateMachineGroupBulkMutation();
  useEffect(() => {
    if (!isLoading && machineGroupData) {
      const list: IMachineGroup[] | undefined = [...machineGroupData];
      const sanitizedData = list?.map((item) => {
        return {
          id: item.id,
          isShow: item.isShow ?? false,
          name: item.name,
        };
      });
      setValue('machineGroups', sanitizedData);
    }
  }, [isLoading, machineGroupData]);

  const handleSubmitData: SubmitHandler<
    TManageGroupMachineRequestFormObject
  > = async (formData, event) => {
    if (!formData.machineGroups) return;
    const submitData = formData.machineGroups;
    event?.preventDefault();
    await createMachineGroup(submitData)
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Success manage machine groups`,
            variant: 'success',
          }),
        );
        toggle();
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
    <form id="manageMachineGroup" onSubmit={handleSubmit(handleSubmitData)}>
      <p>
        Grouping your machine can help you to organize and set up. You can
        create new group and assign them names.
      </p>
      <Button
        onClick={() => appendFieldArray({ name: '', isShow: false })}
        variant={'ghost'}
        type="button"
        className="my-4 text-rs-v2-mint hover:bg-rs-v2-mint hover:text-rs-v2-navy-blue"
      >
        Add Group <AiOutlinePlus className="ml-2" />
      </Button>
      <div className="max-h-[320px] overflow-y-auto">
        {fields.map((field, index) => (
          <div className="mb-4 flex items-center gap-2" key={field.id}>
            <div className="flex-1">
              <Controller
                name={`machineGroups.${index}.name`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <InputComponent
                    value={value}
                    onChange={onChange}
                    placeholder="Name Group..."
                    //   inputStyle="bg-rs-v2-navy-blue hover:bg-rs-v2-navy-blue !focus-visible:bg-rs-v2-navy-blue"
                  />
                )}
              />
            </div>
            <div className="flex flex-1 items-center justify-center gap-2">
              <p>HIDE</p>
              <Controller
                name={`machineGroups.${index}.isShow`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SwitchComponent
                    className="data-[state=unchecked]:bg-rs-v2-grey-disable"
                    onCheckedChange={onChange}
                    defaultChecked={value}
                    value={value ?? false}
                  />
                )}
              />
              <p>SHOW</p>
            </div>
            <Button
              type="button"
              // disabled={index === 0}
              onClick={() => removeFieldArray(index)}
              className="w-9 bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white disabled:text-rs-v2-grey-disable"
            >
              <MdDelete size={24} />
            </Button>
          </div>
        ))}
      </div>
      <DrawerSubmitAction
        toggle={toggle}
        submitText="Save Changes"
        disabled={!isDirty || !isValid || isLoadingCreateMachineGroup}
        form="manageMachineGroup"
        cancelText="Cancel"
      />
    </form>
  );
};

export default ManageMachineGroupForm;
