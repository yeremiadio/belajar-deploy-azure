import {
  IBackendDataPageShape,
  TPaginationResponse,
  TBackendPaginationRequestObject,
  BackendResponse,
} from '@/types/api';

import { mainStoreAPI } from '@/stores/mainStore/mainStoreApi';

import {
  IRecipeObjRequest,
  IRecipeObjResponse,
  TRecipeRequestFormObject,
} from '@/types/api/management/recipe';
import { Nullable } from '@/types/global';

const recipeUrl = '/recipes';

export const recipeStoreAPI = mainStoreAPI.injectEndpoints({
  endpoints: (builder) => {
    return {
      getRecipes: builder.query<
        TPaginationResponse<IRecipeObjResponse[]>,
        TBackendPaginationRequestObject<Partial<IRecipeObjRequest>> & {
          isPaginated?: boolean;
        }
      >({
        query: (obj) => {
          return {
            url: recipeUrl,
            method: 'GET',
            params: { ...obj },
          };
        },
        transformResponse: (
          response: IBackendDataPageShape<IRecipeObjResponse[]>,
        ) => response.data,
        providesTags: ['recipeList'],
      }),
      getRecipesDetails: builder.query<
        IRecipeObjResponse,
        {
          id?: number;
          targetProduction?: number;
          machineId?: number;
        }
      >({
        query: ({ id, targetProduction }) => {
          return {
            url: `${recipeUrl}/${id}`,
            method: 'GET',
            params: {
              targetProduction,
            },
          };
        },
        transformResponse: (res: BackendResponse<IRecipeObjResponse>) => {
          return res.data;
        },
        providesTags: ['recipeList'],
      }),
      getMachineRecipesDetails: builder.query<
        IRecipeObjResponse,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${recipeUrl}/${id}/machines`,
            method: 'GET'
          };
        },
        transformResponse: (res: BackendResponse<IRecipeObjResponse>) => {
          return res.data;
        },
        providesTags: ['recipeList'],
      }),
      deleteRecipe: builder.mutation<
        BackendResponse<string>,
        {
          id: number;
        }
      >({
        query: ({ id }) => {
          return {
            url: `${recipeUrl}/${id}`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['recipeList'],
      }),
      createRecipe: builder.mutation<
        BackendResponse<object>,
        Partial<
          Omit<TRecipeRequestFormObject, 'inventoryId' | 'recipeIngredients'> & {
            inventoryId: number,
            recipeIngredients: {
              inventoryId: Nullable<number>;
              amount: number;
            }[];
          }
        >
      >({
        query: (obj) => {
          return {
            url: `${recipeUrl}`,
            body: obj,
            method: 'POST',
          };
        },
        invalidatesTags: ['recipeList'],
      }),
      updateRecipe: builder.mutation<
        BackendResponse<object>,
        {
          id: number;
          data: Partial<
            Omit<TRecipeRequestFormObject, 'inventoryId' | 'recipeIngredients'> & {
              inventoryId: number,
              recipeIngredients: {
                inventoryId: Nullable<number>;
                amount: number;
              }[];
            }
          >;
        }
      >({
        query: ({ id, data }) => {
          return {
            url: `${recipeUrl}/${id}`,
            body: data,
            method: 'PATCH',
          };
        },
        invalidatesTags: ['recipeList'],
      }),
    };
  },
});

export const {
  useGetRecipesQuery,
  useGetRecipesDetailsQuery,
  useDeleteRecipeMutation,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useGetMachineRecipesDetailsQuery,
  util: { resetApiState: resetRecipeStoreAPI },
} = recipeStoreAPI;
