import { LoadingCheckIcon } from '@/assets/images';

export const LoadingSection = () => {
  return (
    <div
      className="fixed left-0 top-0 z-[100] flex h-screen w-full justify-center  bg-[#111928] p-5"
      onClick={(e) => {
        e?.preventDefault();
      }}
    >
      <div className="flex h-full w-full max-w-[480px] flex-col items-center justify-center p-5">
        <img
          src={LoadingCheckIcon}
          alt="Loading Check Icon"
          className="w-full"
        />
      </div>
    </div>
  );
};
