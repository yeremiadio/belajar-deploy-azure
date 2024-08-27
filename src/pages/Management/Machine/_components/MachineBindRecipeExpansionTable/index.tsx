import { useMemo } from 'react';
import { MdLinkOff, MdOutlineEdit } from 'react-icons/md';
import { ColumnDef, Row } from '@tanstack/react-table';

import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import { ExpansionTable } from '@/components/Table/ExpansionTable';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';

import BindRecipeForm from '@/pages/Management/Machine/_components/BindRecipeForm';

import { useDeleteBindRecipeMachineMutation } from '@/stores/managementStore/machineStore/machineStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { IMachine, IMachineRecipe } from '@/types/api/management/machine';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { useModal } from '@/utils/hooks/useModal';
import useRecipeOpts from '@/utils/hooks/selectOptions/useRecipeOptions';

const MachineBindRecipeExpansionTable = ({
  original: dataMachine,
}: Row<IMachine>) => {
  const { toast } = useToast();
  const { arr, isLoading } = useRecipeOpts({ isPaginated: false });

  const columns = useMemo<ColumnDef<IMachineRecipe>[]>(() => {
    return [
      {
        accessorKey: 'no',
        header: 'No.',
        maxSize: 10,
        cell: (context) => context.row.index + 1,
      },
      {
        id: 'name',
        header: 'Recipe',
        cell: ({ row }) => row.original?.recipe?.name ?? '-',
      },
      {
        id: 'inventory',
        header: 'Product',
        accessorKey: 'recipe',

        cell: ({ row }) => {
          const { recipeId } = row.original;
          const recipe = arr.find((val) => {
            return val.value === recipeId;
          });
          return recipe?.inventory?.name ?? recipeId;
        },
      },
      {
        id: 'cycleRate',
        header: 'Cycle Rate',
        cell: ({ row }) => {
          const { cycleRate, recipeId } = row.original;
          const recipe = arr.find((val) => {
            return val.value === recipeId;
          });
          const calculatedValue =
            cycleRate && recipe?.output ? recipe?.output / cycleRate : 0;
          const calculatedUnit = `${recipe?.inventory?.unit ?? 'Kg'}/hour`;
          return (
            <p>
              {calculatedValue?.toFixed(2) ?? 0} {calculatedUnit}
            </p>
          );
        },
      },
      {
        accessorKey: 'id',
        header: 'Action',
        cell: ({ row }) => {
          const data = row.original;

          const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
          const { toggle: toggleUnbind, isShown: isShownUnbind } = useModal();
          const [unbindMachineRecipe, { isLoading: isLoadingUnbindMachine }] =
            useDeleteBindRecipeMachineMutation();
          const handleUnbind = async () => {
            if (!dataMachine || !data) return;
            await unbindMachineRecipe({
              id: dataMachine.id,
              machineRecipeId: data.id,
            })
              .unwrap()
              .then(() => {
                toast(
                  generateDynamicToastMessage({
                    title: 'Success',
                    description: `Success unbind machine recipe ${data?.recipe?.name ?? ''}`,
                    variant: 'success',
                  }),
                );
                toggleUnbind();
              })
              .catch((error: ErrorMessageBackendDataShape) => {
                const { title, message } = generateStatusCodesMessage(
                  error.status,
                );
                toast(
                  generateDynamicToastMessage({
                    title,
                    description: `${message} "\n${error?.data?.message ?? ''}"`,
                    variant: 'error',
                  }),
                );
                toggleUnbind();
              });
          };

          return (
            <DivPropagationWrapper className="flex flex-wrap items-center gap-2">
              <Modal
                title="Edit Recipe"
                toggle={toggleEdit}
                isShown={isShownEdit}
              >
                <BindRecipeForm
                  data={dataMachine}
                  isEditing
                  selectedData={data}
                  toggle={toggleEdit}
                />
              </Modal>
              <Modal
                title="Unbind Recipe"
                toggle={toggleUnbind}
                isShown={isShownUnbind}
                description={`Unbinding ${data?.recipe?.name} from the Machine ${dataMachine?.name ?? '-'} will detach the recipe and have consequences to this machine.`}
              >
                <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                  <DrawerClose asChild>
                    <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                      Cancel
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      onClick={handleUnbind}
                      className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                    >
                      Unbind
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </Modal>
              <Button
                onClick={() => toggleEdit()}
                className="bg-transparent p-[5px] text-rs-azure-blue hover:bg-rs-azure-blue hover:text-white"
              >
                <MdOutlineEdit size={24} />
              </Button>
              <Button
                onClick={() => toggleUnbind()}
                disabled={isLoadingUnbindMachine}
                className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
              >
                <MdLinkOff size={24} />
              </Button>
            </DivPropagationWrapper>
          );
        },
      },
    ];
  }, [dataMachine, isLoading]);
  return (
    <ExpansionTable
      isShowNumbering
      columns={columns}
      isShowPagination={false}
      data={dataMachine.machineRecipes}
      noDataText="No recipe bound to this machine yet."
    />
  );
};

export default MachineBindRecipeExpansionTable;
