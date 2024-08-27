import { describe, it } from 'vitest';

import DropdownComponent from '@/components/Dropdown';
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { RxCaretDown } from 'react-icons/rx';


const toggleEdit = vi.fn();
const togglePermission = vi.fn();


vi.mock('@/utils/hooks/useModal', () => ({
    useModal: () => ({
      isShown: false,
      toggleEdit,
      togglePermission,
    }),
  }));
  
  const actionsDropdown = [
    { label: 'Edit Account', onClick: toggleEdit },
    { label: 'Edit Permission', onClick: togglePermission },
  ];

describe('DropdownComponent', () => {
    it('should render the button with the placeholder text', () => {
      render(
        <DropdownComponent
          menuItems={[]}
          placeholder="Action"
          Icon={RxCaretDown}
        />,
      );
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  
    it('should open the dropdown menu when the button is clicked', async () => {
      render(
        <DropdownComponent menuItems={actionsDropdown} placeholder="Action" />,
      );
  
      const button = screen.getByRole('button', { name: 'Action' });
  
      // Initially, the dropdown should be closed
      expect(button).toHaveAttribute('aria-expanded', 'false');
  
      // Click the button to open the dropdown
      fireEvent.click(button);
  
      // Wait for the dropdown to open and aria-expanded to be true
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
  
      // Check if the dropdown menu items are rendered
      expect(screen.getByText('Edit Account')).toBeInTheDocument();
      expect(screen.getByText('Edit Permission')).toBeInTheDocument();
    });
  
    it('should call the correct function when a dropdown item "Edit Account" is clicked', async () => {
      render(
        <DropdownComponent menuItems={actionsDropdown} placeholder="Action" />,
      );
      const button = screen.getByRole('button', { name: 'Action' });
  
      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
      const editAccount = screen.getByText('Edit Account');
      expect(editAccount).toBeInTheDocument();
  
      // Click the "Edit Account" menu item
      fireEvent.click(editAccount);
      expect(toggleEdit).toHaveBeenCalledTimes(1);
    });
  
    it('should call the correct function when a dropdown item "Edit Permission" is clicked', async () => {
      render(
        <DropdownComponent menuItems={actionsDropdown} placeholder="Action" />,
      );
      const button = screen.getByRole('button', { name: 'Action' });
  
      expect(button).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
      const editPermission = screen.getByText('Edit Permission');
      expect(editPermission).toBeInTheDocument();
  
      // Click the "Edit Permission" menu item
      fireEvent.click(editPermission);
      expect(togglePermission).toHaveBeenCalledTimes(1);
    });
  });