import { Outlet } from 'react-router-dom';

const MobileLayout = () => {
  return (
    <div
      className={`flex w-full justify-center
    `}
    >
      <div className="w-full max-w-[480px] p-5">
        <Outlet />
      </div>
    </div>
  );
};
export default MobileLayout;
