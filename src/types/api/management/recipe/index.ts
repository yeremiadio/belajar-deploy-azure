import * as yup from 'yup';

import recipeValidationSchema from '@/utils/validations/management/recipe/recipeValidationSchema';

import { IMachineRecipe } from '@/types/api/management/machine';
import { Nullable } from '@/types/global';

export interface IRecipeInventoryObj {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
  name: string;
  uniqueId: string;
  companyId: number;
  type: string;
  unit: string;
  price: number;
  stock: number;
}

export interface IRecipeIngredientsObj {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: Nullable<string>;
  amount: number;
  inventoryId: number;
  recipeId: number;
  totalAmount: number;
  isReady: boolean;
  inventory: IRecipeInventoryObj;
}

export interface IRecipeObjResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  output: number;
  inventoryId: number;
  companyId: number;
  inventory: IRecipeInventoryObj;
  recipeIngredients: IRecipeIngredientsObj[];
  machineRecipes: IMachineRecipe[];
  unit: string;
}

export interface IRecipeObjRequest {
  name: string;
}

export interface IRecipeParameterObject extends IRecipeObjRequest {
  isPaginated?: boolean;
}

/**
 * validation interface from yup
 * used in POST `/api/recipes`
 */
export type TRecipeRequestFormObject = yup.InferType<
  typeof recipeValidationSchema
>;
