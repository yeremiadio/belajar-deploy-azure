import { useEffect } from 'react';
import { MdLogout } from 'react-icons/md';
import { useSelector } from 'react-redux';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { localization } from '@/utils/functions/localization';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useLogout from '@/utils/hooks/useLogout';

import { CarouselMenu } from './_components/CarouselMenu';
import { ScanQR } from './_components/ScanQR';

export default function MobileReservationPage() {
  const htmlId = 'mobileReservationId';
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const language = useSelector(selectLanguage);

  return (
    <div
      className="flex w-full flex-col justify-between gap-5"
      style={{
        height: `calc(100vh - 40px)`,
      }}
    >
      <div className="flex flex-col gap-5">
        <CarouselMenu />
        <ScanQR />
      </div>

      <button
        onClick={handleLogout}
        className={
          'mt-5 flex items-center justify-center gap-2 rounded-xl border border-rs-v2-red py-4 text-rs-v2-red hover:border-rs-v2-red/80 hover:text-rs-v2-red/80'
        }
      >
        <MdLogout className="text-2xl" />
        <p className="text-base font-medium">
          {localization('Logout', language)}
        </p>
      </button>
    </div>
  );
}
