import { describe, it } from 'vitest';

import GenerateQR from '@/pages/Management/Machine/_components/GenerateQR/GenerateQR';

import { IMachine } from '@/types/api/management/machine';

import { render, screen } from '@testing-library/react';

// const store = setupStore();

vi.mock('axios');

// function Wrapper(props: { children: ReactNode }) {
//   return <Provider store={store}>{props.children}</Provider>;
// }

describe('GenerateQR', () => {
  //   beforeEach(() => {
  //     const cookiesObject = {
  //       token:
  //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIwLCJ1c2VybmFtZSI6InN1cGVyYWRtaW5CYWNrZW5kIiwidXNlcnR5cGVJZCI6MiwidXNlcnR5cGVOYW1lIjoic3VwZXJhZG1pbiIsImNvbXBhbnlJZCI6MzksImNvbXBhbnlOYW1lIjoiUFQuIEJhY2tlbmQgRGV2ZWxvcG1lbnQiLCJpYXQiOjE3MTU1ODEyMzYsImV4cCI6MTcxNTY2NzYzNn0.2X_Q8xnhCn-WfnqIxjti-2AOfv_JIrvM1BY3VXLP8gI',
  //     };
  //     saveTheseCookies({ ...cookiesObject });
  //   });
  //   it('should renders get machine by id hook', () => {
  //     const token = loadCookie('token');
  //     const test = renderHook(() => useGetmachineByIdQuery({ id: 46 }), {
  //       wrapper: Wrapper,
  //     });
  //     console.log(test);
  //     console.log({ token });
  //   });
  it('should render qr code svg if data machine code exist', async () => {
    const machineData = {
      id: 45,
      code: 'M003',
      name: 'Machine 003',
    };
    render(<GenerateQR toggle={() => {}} data={machineData as IMachine} />);
    const element = screen.getByTestId('qr-code');
    expect(element).toBeInTheDocument();
  });
  it('should not render qr code svg if data machine code not exist', async () => {
    const machineData = {
      id: 45,
      code: '',
      name: 'Machine 003',
    };
    render(<GenerateQR toggle={() => {}} data={machineData as IMachine} />);
    const element = screen.queryByTestId('qr-code');
    expect(element).not.toBeInTheDocument();
  });
});
