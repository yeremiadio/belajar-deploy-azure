import { useNavigate } from 'react-router-dom';

import { AvatarImage } from '@/assets/images';

import { loadCookiesOfKeys } from '@/services/cookie';

import { IUserCredentialData } from '@/types/api/user';

import { ROUTES } from '@/utils/configs/route';
import { useGetUserProfileImageQuery } from '@/stores/userStore/userStoreApi';

type Props = {
  collapse: boolean;
};

export default function Profile({ collapse }: Props) {
  const navigate = useNavigate();

  const { data: profileImage } = useGetUserProfileImageQuery();
  const { username } = loadCookiesOfKeys<IUserCredentialData>(['username']);
  const trimName = username
    ? username.length > 18
      ? `${username.slice(0, 18)}...`
      : username
    : 'John Doe';

  const handleClick = () => {
    navigate(ROUTES.profile);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 ${collapse && 'justify-center'}`}
    >
      <div className="h-[32px] w-[32px] rounded-full">
        <img
          src={profileImage ?? AvatarImage}
          alt="avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      {collapse ? null : <p className="flex-shrink-0">{trimName}</p>}
    </button>
  );
}
