import { MdLogout } from 'react-icons/md';

import { AvatarImage, RapidsenseLogo } from '@/assets/images';

import { loadCookiesOfKeys } from '@/services/cookie';

import { IUserCredentialData } from '@/types/api/user';

import useLogout from '@/utils/hooks/useLogout';
import useProfileImage from '@/utils/hooks/auth/useProfileImage';

const TopBar = () => {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const profileImage = useProfileImage();
  const { username } = loadCookiesOfKeys<IUserCredentialData>(['username']);
  const trimName = username
    ? username.length > 18
      ? `${username.slice(0, 18)}...`
      : username
    : 'John Doe';

  return (
    <div className="flex justify-between border-b border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-5 px-7">
      <img src={RapidsenseLogo} alt="rapidsense" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={profileImage ?? AvatarImage}
            alt="avatar"
            className="h-[32px] w-[32px] rounded-full"
          />
          {<p className="flex-shrink-0">{trimName}</p>}
        </div>

        <button
          onClick={handleLogout}
          className="hover:text-rs-alert/80 flex w-fit text-rs-v2-red"
        >
          <MdLogout className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
