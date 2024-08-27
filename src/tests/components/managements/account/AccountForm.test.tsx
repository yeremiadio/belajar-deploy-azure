import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it } from 'vitest';

import UserForm from '@/pages/Management/Account/_component/userForm/userForm';

import { setupStore } from '@/stores/index.ts';

import { renderWithProviders } from '@/tests/setup';


const mockToggle = vi.fn();

describe('User Form', () => {
  let store;

  beforeEach(() => {
    store = setupStore();

    render(
      <Provider store={store}>
        <Router>
          <UserForm toggle={mockToggle} />
        </Router>
      </Provider>,
    );
  });

  it('should have User form ID', async () => {
    await waitFor(() => {
      const form = document.getElementById('userForm');
      expect(form).toBeInTheDocument();
    });
  });

  it('should submit the form with valid data for creating Account', async () => {
    await act(async () => {
      renderWithProviders(<UserForm toggle={mockToggle} isEditing={false}/>);
    });

    // Filling out the form fields
    const inputFirstname = screen.getAllByPlaceholderText('Firstname');
    const inputLastname = screen.getAllByPlaceholderText('Lastname');
    const inputEmail = screen.getAllByPlaceholderText('Email');
    const inputUsername = screen.getAllByPlaceholderText('Username');
    const inputPhoneNumber = screen.getAllByPlaceholderText('Whatsapp Number');

    await act(async () => {
        userEvent.type(inputFirstname[0], 'Budi');
        userEvent.type(inputLastname[0], 'Raharjo');
        userEvent.type(inputEmail[0], 'Budi@gmail.com');
        userEvent.type(inputUsername[0], 'BudiRahajo');
        userEvent.type(inputPhoneNumber[0], '0967676434444');
    });
 
  const addButton = screen.getAllByRole('button', { name: 'Add Account' });
  const submitButton = addButton[0];
  
  await act(async () => {
    userEvent.click(submitButton);
  });
 
  });
});
