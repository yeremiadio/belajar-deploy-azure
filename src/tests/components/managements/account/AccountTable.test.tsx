import { describe, it } from 'vitest';

import AccountPage from '@/pages/Management/Account/AccountPage';
import { renderWithProviders } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';
import {
  act,
  fireEvent,
  screen,
} from '@testing-library/react';
import useUserType from '@/utils/hooks/auth/useUserType';

const toggle = vi.fn();

vi.mock('@/utils/hooks/useModal', () => ({
  useModal: () => ({
    isShown: false,
    toggle,
  }),
}));


describe('Account Page with Table', () => {
  const currentUserType = useUserType();
  initiateServer();

  beforeEach(() => {
    renderWithProviders(<AccountPage />);
    screen.debug();
  });

  it('should render AccountPage with title', () => {
    act(() => {
      expect(screen.getByText('Management Account')).toBeInTheDocument();
    });
  });

  it('should render "name" column', () => {
    act(() => {
      const nameColumn = screen.getByText('Name');
      expect(nameColumn).toBeInTheDocument();
    });
  });

  it('should render "company" column', () => {
    if (currentUserType === 'systemadmin') {
      // Check if the "Company" column is rendered for systemadmin
      const companyHeader = screen.getByText('Company');
      expect(companyHeader).toBeInTheDocument();
    } else {
      // Check if the "Company" column is not rendered for non-systemadmin
      const companyHeader = screen.queryByRole('columnheader', {
        name: 'Company',
      });
      expect(companyHeader).toBeNull();
    }
  });

  it('should render table with role column', () => {
    act(() => {
      const roleColumn = screen.getByText('Role');
      expect(roleColumn).toBeInTheDocument();
    });
  });

  it('should render table with username column', () => {
    act(() => {
      const usernameColumn = screen.getByText('Username');
      expect(usernameColumn).toBeInTheDocument();
    });
  });

  it('should render table with email column', () => {
    act(() => {
      const emailColumn = screen.getByText('Email');
      expect(emailColumn).toBeInTheDocument();
    });
  });

  it('should render table with whatsapp number column', () => {
    act(() => {
      const phoneNumberColumn = screen.getByText('Whatsapp Number');
      expect(phoneNumberColumn).toBeInTheDocument();
    });
  });

  it('should render "action" column', () => {
    act(() => {
      const actionColumn = screen.getByText('Action');
      expect(actionColumn).toBeInTheDocument();
    });
  });

  it('should render "Add Account" button and call toggle on click', () => {
    // Find the button by its role and name
    const addButton = screen.getByRole('button', { name: 'Add Account' });
    expect(addButton).toBeInTheDocument();

    // Click the button and verify the function call
    fireEvent.click(addButton);
    expect(toggle).toHaveBeenCalledTimes(1);
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
