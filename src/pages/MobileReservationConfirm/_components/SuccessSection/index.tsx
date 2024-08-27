import { ChecklistSuccessIcon } from '@/assets/images';

export const SuccessSection = () => {
  return (
    <div
      className="fixed left-0 top-0 z-[100] flex h-screen w-full justify-center bg-[#111928] p-5"
      onClick={(e) => {
        e?.preventDefault();
      }}
    >
      <div className="flex h-full w-full max-w-[480px] flex-col items-center justify-center gap-4 p-10">
        <img
          src={ChecklistSuccessIcon}
          alt="Checklist Success Icon"
          className="w-[60px]"
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl font-semibold">Thank You</h1>
          <p className="text-xs font-normal">
            The form was submitted successfully.
          </p>
        </div>
      </div>
    </div>
  );
};
