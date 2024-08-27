import {
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useGetRecipesDetailsQuery,
  useGetRecipesQuery,
  useUpdateRecipeMutation,
} from '@/stores/managementStore/recipeStore';
import {
  exampleData,
  exampleRequestData,
  recipeHandlers,
} from '@/tests/mocks/handlers/recipeHandlers';
import { customWrapper } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';
import { act, renderHook, waitFor } from '@testing-library/react';

describe('Recipe API Store', () => {
  initiateServer();

  describe('Read', () => {
    it('should fetch all recipe', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetRecipesQuery({
            page: 1,
            take: 10,
            isPaginated: true,
          });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: recipeHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toEqual(exampleData.data);
      });
    });

    it('should fetch a single recipe', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetRecipesDetailsQuery({ id: 1 });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: recipeHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toEqual(exampleData.data.entities[0]);
      });
    });

    it('should return undefined if recipe is not found', async () => {
      const { result } = renderHook(
        () => {
          const { data } = useGetRecipesDetailsQuery({ id: 1000 });
          return data;
        },
        {
          wrapper: customWrapper({
            handlers: recipeHandlers,
          }),
        },
      );

      await waitFor(() => {
        expect(result.current).toBeUndefined();
      });
    });
  });

  describe('Create', () => {
    it('should create a new recipe', async () => {
      const { result } = renderHook(() => useCreateRecipeMutation(), {
        wrapper: customWrapper({
          handlers: recipeHandlers,
        }),
      });

      const [createRecipe] = result.current;

      act(() => {
        createRecipe(exampleRequestData);
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });

  describe('Update', () => {
    it("should update a recipe's output & inventory", async () => {
      const { result } = renderHook(() => useUpdateRecipeMutation(), {
        wrapper: customWrapper({
          handlers: recipeHandlers,
        }),
      });

      const [patchRecipe] = result.current;

      act(() => {
        patchRecipe({
          id: 1,
          data: {
            inventoryId: 2,
            output: 10.5,
          },
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });

    it("should add a new recipe's ingredients", async () => {
      const { result } = renderHook(() => useUpdateRecipeMutation(), {
        wrapper: customWrapper({
          handlers: recipeHandlers,
        }),
      });

      const [patchRecipe] = result.current;

      act(() => {
        patchRecipe({
          id: 1,
          data: {
            recipeIngredients: [
              {
                inventoryId: 4,
                amount: 4.4,
              },
              {
                inventoryId: 6,
                amount: 6.6,
              },
            ],
          },
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });

  describe('Delete', () => {
    it('should delete a recipe', async () => {
      const { result } = renderHook(() => useDeleteRecipeMutation(), {
        wrapper: customWrapper({
          handlers: recipeHandlers,
        }),
      });

      const [deleteRecipe] = result.current;

      act(() => {
        deleteRecipe({
          id: 1,
        });
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current[1].isSuccess).toBe(true);
      });
    });
  });
});
