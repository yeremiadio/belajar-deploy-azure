import { describe, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from '@/stores/index.ts';

import { RecipeForm } from '@/pages/Management/Recipe/_components/RecipeForm';

describe('Recipe Form', () => {
  let store;

  beforeEach(() => {
    store = setupStore();

    render(
      <Provider store={store}>
        <Router>
          <RecipeForm toggle={() => {}} />
        </Router>
      </Provider>,
    );
  });

  it('should have Recipe form ID', async () => {
    await waitFor(() => {
      const form = document.getElementById('recipeForm');
      expect(form).toBeInTheDocument();
    });
  });

  it('should renders form fields and elements correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText("Recipe's Name")).toBeInTheDocument();
      expect(screen.getByText('Production Output')).toBeInTheDocument();
      expect(screen.getByText('Amount')).toBeInTheDocument();
      /**
       * @description form have 2 input with same label that make error  (Inventory)
       */
      //   expect(screen.getByText('Inventory')).toBeInTheDocument();
    });
  });
});
