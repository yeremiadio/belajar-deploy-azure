import { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import Copilot from '@/components/Copilot';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
import { BaseTable } from '@/components/Table/BaseTable';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import TopBar from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';
import GroupTableButton from '@/components/Wrapper/ButtonWrapper/GroupTableButton';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';
import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import {
  useDeleteRecipeMutation,
  useGetRecipesQuery,
} from '@/stores/managementStore/recipeStore';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { IRecipeObjResponse } from '@/types/api/management/recipe';
import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { removeEmptyObjects } from '@/utils/functions/removeEmptyObjects';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useModal } from '@/utils/hooks/useModal';
import { ColumnDef } from '@tanstack/react-table';

import { RecipeForm } from './_components/RecipeForm';

const RecipePage = () => {
  const htmlId = 'managementRecipeId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { toggle, isShown } = useModal();
  const { toast } = useToast();

  // useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchNameParams = searchParams.get('name');
  const getPageParams = searchParams.get('page');
  const getTakeParams = searchParams.get('take');

  const [searchName, setSearchName] = useState<string>(searchNameParams ?? '');
  const debouncedSearchName = useDebounce(searchName, 1500);

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  // re-assign params
  useEffect(() => {
    if (debouncedSearchName && debouncedSearchName.length > 1) {
      searchParams.set('name', debouncedSearchName);
      searchParams.set('page', '1');
    } else {
      searchParams.delete('name');
    }
    setSearchParams(searchParams);
  }, [debouncedSearchName]);

  const activeFilter = removeEmptyObjects({
    page: getPageParams ?? page,
    take: getTakeParams ?? take,
    name: debouncedSearchName,
  });

  const {
    data: recipeList,
    isLoading,
    isFetching,
  } = useGetRecipesQuery({ ...activeFilter, isPaginated: true });

  const loading = isLoading || isFetching;

  const recipeListMemo = useMemo<IRecipeObjResponse[]>(() => {
    if (!recipeList) return [];
    const companyList = recipeList.entities.slice();
    return companyList;
  }, [recipeList]);

  const recipeListMeta = useMemo(() => {
    return recipeList?.meta;
  }, [recipeList]);

  const columns: ColumnDef<IRecipeObjResponse>[] = [
    {
      accessorKey: 'name',
      header: "Recipe's Name",
      cell: ({ row: { original } }) => original.name ?? '-',
    },
    {
      accessorKey: 'inventory',
      header: 'Inventory',
      cell: ({ row: { original } }) => original.inventory?.name ?? '-',
    },
    {
      accessorKey: 'output',
      header: 'Production Output',
      cell: ({ row: { original } }) => {
        const { output, inventory } = original;
        return output && inventory ? `${output} ${inventory?.unit}` : '-';
      },
    },
    {
      accessorKey: 'Ingredients',
      header: 'Ingredients',
      cell: ({ row: { original } }) => {
        const { recipeIngredients } = original;
        return (
          <div className="flex flex-wrap items-center gap-1">
            {recipeIngredients.length > 0 ? (
              <GroupTableButton
                groups={recipeIngredients
                  .filter((item) => item.inventory)
                  .map((item) => {
                    const { id, name, unit } = item.inventory;
                    return {
                      id,
                      name: `${name} : ${item.amount} ${unit}`,
                      groupColor: '#00C2ED4D',
                    };
                  })}
              />
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      cell: ({ row: { original: data } }) => {
        const [deleteRecipe, { isLoading: isLoadingDeletingAlert }] =
          useDeleteRecipeMutation();
        const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
        const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
        const { toggle: toggleAddIngredients, isShown: isShownAddIngredients } =
          useModal();

        const handleDelete = () => {
          deleteRecipe({ id: data.id })
            .unwrap()
            .then(() => {
              toggleDelete();
              toast(
                generateDynamicToastMessage({
                  title: 'Success!',
                  description: 'Recipe deleted successfully',
                  variant: 'success',
                }),
              );
            })
            .catch((error: ErrorMessageBackendDataShape) => {
              toggleDelete();
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
            });
        };

        return (
          <DivPropagationWrapper>
            <Modal
              title="Edit Recipe"
              toggle={toggleEdit}
              isShown={isShownEdit}
            >
              <RecipeForm toggle={toggleEdit} isEditing data={data} />
            </Modal>
            <Modal
              title="Add Ingredients"
              toggle={toggleAddIngredients}
              isShown={isShownAddIngredients}
            >
              <RecipeForm
                toggle={toggleAddIngredients}
                isEditing
                isAddIngredients
                data={data}
              />
            </Modal>
            <Modal
              title="Delete Recipe"
              toggle={toggleDelete}
              isShown={isShownDelete}
              description={`Deleting "${data.name}" will result in its permanent deletion from the system, impacting all associated data related to this Recipe.`}
            >
              <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
                <DrawerClose asChild>
                  <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    onClick={handleDelete}
                    disabled={isLoadingDeletingAlert}
                    className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
                  >
                    {isLoadingDeletingAlert ? (
                      <Spinner
                        size={18}
                        borderWidth={1.5}
                        isFullWidthAndHeight
                      />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </Modal>
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex">
                <Button
                  dataTestId="buttonEditRecipe"
                  onClick={() => {
                    toggleEdit();
                  }}
                  className="btn-bg-gray-800 mr-3 bg-gray-800 text-white hover:bg-gray-700 hover:text-gray-300"
                >
                  Edit Recipe
                </Button>
                <Button
                  dataTestId="buttonAddIngredients"
                  onClick={() => {
                    toggleAddIngredients();
                  }}
                  className="btn-rs-alert-warning disabled:disabled-btn-disabled-slate-blue bg-rs-alert-green text-white hover:bg-green-500 hover:text-gray-300"
                >
                  Add Ingredients
                </Button>
                <Button
                  dataTestId="buttonDeleteRecipe"
                  onClick={() => toggleDelete()}
                  className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                >
                  <MdDeleteOutline size={24} />
                </Button>
              </div>
            </div>
          </DivPropagationWrapper>
        );
      },
    },
  ];
  return (
    <PageWrapper>
      <TopBar title="Management Recipe" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <Modal title="Add Recipe" toggle={toggle} isShown={isShown}>
          <RecipeForm toggle={toggle} />
        </Modal>
        <div className="w-full">
          <BaseTable
            name="recipeTable"
            data={recipeListMemo}
            meta={recipeListMeta}
            columns={columns}
            isFullWidth
            onExportButton
            exportText="Export to CSV"
            exportName="recipes"
            onSearchInput
            onSearchInputChange={setSearchName}
            searchInputValue={searchName}
            withToolbar
            isLoading={loading}
            backendPagination={
              recipeListMeta && (
                <TableBackendPagination
                  page={page}
                  take={take}
                  setPage={setPage}
                  meta={recipeListMeta}
                  setLimit={setLimit}
                />
              )
            }
            additionalSuffixToolbarElement={
              <Button
                className="btn-primary-mint hover:hover-btn-primary-mint"
                onClick={() => toggle()}
              >
                Add Recipe <AiOutlinePlus className="ml-2" />
              </Button>
            }
          />
        </div>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default RecipePage;
