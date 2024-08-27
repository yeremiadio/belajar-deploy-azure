import { describe, it } from 'vitest';

import RecipePage from '@/pages/Management/Recipe/RecipePage';
import { renderWithProviders } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

describe('Recipe Page with Table', () => {
  initiateServer();

  beforeEach(() => {
    renderWithProviders(<RecipePage />);
  });

  it('should render RecipePage with title', () => {
    act(() => {
      expect(screen.getByText('Management Recipe')).toBeInTheDocument();
    });
  });

  it("should render recipe's table", () => {
    act(() => {
      const tableElement = screen.getByRole('table', {
        name: 'recipeTable',
      });
      expect(tableElement).toBeInTheDocument();
    });
  });

  it('should render "recipe\'s name" column', () => {
    act(() => {
      const statusCol = screen.getByText("Recipe's Name");
      expect(statusCol).toBeInTheDocument();
    });
  });

  it('should render "action" column', () => {
    act(() => {
      const statusCol = screen.getByText('Action');
      expect(statusCol).toBeInTheDocument();
    });
  });

  it('renders action buttons in the action column', async () => {
    await waitFor(() => {
      const rows = screen.getAllByRole('row');

      rows.slice(1).forEach((row) => {
        const editRecipeButton = within(row).getByText('Edit Recipe');
        const addIngredientsButton = within(row).getByText('Add Ingredients');
        const deleteButton = within(row).getByTestId('buttonDeleteRecipe');

        expect(editRecipeButton).toBeInTheDocument();
        expect(addIngredientsButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();

        // Simulate button clicks
        fireEvent.click(editRecipeButton);
        fireEvent.click(addIngredientsButton);
        fireEvent.click(deleteButton);
      });
    });
  });

  it('should renders "add recipe" button', () => {
    act(() => {
      const addButton = screen.getByText('Add Recipe');
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);
    });
  });

  it('should render Export CSV button', () => {
    act(() => {
      const exportButton = screen.getByText('Export to CSV');
      expect(exportButton).toBeInTheDocument();
      fireEvent.click(exportButton);
    });
  });

  it('should render handle search input', () => {
    act(() => {
      const searchInput = screen.getByPlaceholderText(
        'Search...',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe('test');
    });
  });
});
