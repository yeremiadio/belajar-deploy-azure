import { FC } from 'react';

import { LoginBackground, RapidsenseLogo } from '@/assets/images';

type Props = {
  title: string;
  children: React.ReactNode;
};

const AuthContainer: FC<Props> = ({ children, title }) => {
  return (
    <section className="min-[2000px]:container min-[2000px]:h-[1000px] relative mx-auto h-screen overflow-clip">
      <div className="absolute z-20 flex h-full w-full flex-col justify-end gap-5 px-10 pb-20 sm:px-20 lg:w-[50%] lg:justify-center lg:pb-0 xl:px-[10rem]">
        <img
          src={RapidsenseLogo}
          alt="rapidsense"
          width={47}
          height={53}
          className="mb-4"
        />
        <h1 className="relative mb-4 w-fit text-4xl font-bold text-white">
          {title}
          <span className="bg-bp-yellow absolute right-[-1.5rem] top-0 z-[-1] block h-[50px] w-[50px] rounded-full" />
        </h1>

        {children}
      </div>

      {/* Background */}
      <span
        className="absolute z-10 h-full w-full translate-x-[-3rem] opacity-90 sm:translate-x-0 lg:opacity-100"
        style={{
          background:
            'linear-gradient(86deg, #111928 47%, rgba(17, 25, 40, 0.8) 60%, rgba(17, 25, 40, 0) 83.58%)',
        }}
      />
      <span className="absolute bottom-0 left-0 z-[15] block h-[650px] w-[650px] translate-x-0 translate-y-[17rem] rounded-full bg-[#111928] blur-[315px] sm:translate-x-[-10rem]" />
      <div className="z-[-20] flex h-full w-full justify-end">
        <img
          src={LoginBackground}
          alt="Rapidsense"
          className="h-full object-cover object-right"
        />
      </div>
    </section>
  );
};

export default AuthContainer;
