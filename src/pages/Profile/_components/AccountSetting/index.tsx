import { useRef, useState } from 'react';
import { MdOutlineCheckCircleOutline, MdOutlineModeEdit } from 'react-icons/md';

import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { useModal } from '@/utils/hooks/useModal';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';

import { DummyAvatar } from '@/assets/images';

import AccountForm from '../AccountForm';
import {
  useGetUserProfileImageQuery,
  useGetUserProfileQuery,
  usePostUserProfileImageMutation,
} from '@/stores/userStore/userStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';

import useUsertypeOpts from '@/utils/hooks/selectOptions/useUsertypeOptions';
import useCompanyOpts from '@/utils/hooks/selectOptions/useCompanyOptions';
import Spinner from '@/components/Spinner';

const AccountSetting = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { isShown, toggle } = useModal();
  const { toast } = useToast();

  const [postProfileImage, { isLoading: savingProfileImage }] =
    usePostUserProfileImageMutation();

  const { data: currentAvatar } = useGetUserProfileImageQuery();

  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const { data: userProfileData } = useGetUserProfileQuery();
  const { arr: usertypeOptions } = useUsertypeOpts({ excludeRoles: false });
  const { arr: companyOptions } = useCompanyOpts({ isPaginated: false });

  const sanitizedProfileData = [
    {
      label: 'Username',
      value: userProfileData?.username ?? '-',
    },
    {
      label: 'Display Name',
      value: userProfileData?.firstname + ' ' + userProfileData?.lastname,
    },
    {
      label: 'Role',
      value:
        usertypeOptions?.find((item) => item.id === userProfileData?.usertypeId)
          ?.label ?? '-',
    },
    {
      label: 'Company',
      value:
        companyOptions?.find(
          (item) => item.value === userProfileData?.companyId,
        )?.label ?? '-',
    },
    {
      label: 'Email',
      value: userProfileData?.email,
      verified: userProfileData?.emailVerified ?? false,
    },
    {
      label: 'Whatsapp No.',
      value: userProfileData?.phonenumber ?? '-',
      verified: userProfileData?.phoneVerified ?? false,
    },
  ];

  const handleUploadAvatar = () => {
    inputFileRef.current?.click();
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      await postProfileImage(file)
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: `Profile image updated successfully`,
              variant: 'success',
            }),
          );
        })
        .catch((error: ErrorMessageBackendDataShape) => {
          toast(
            generateDynamicToastMessage({
              title: 'Failed',
              description: `Failed to update profile image "\n${error?.data?.message ?? ''}"`,
              variant: 'error',
            }),
          );
        });
    }
  };

  return (
    <>
      <Card className="mb-5 h-fit px-5 pb-10 pt-5">
        <div className="mb-5 flex items-center justify-between gap-5">
          <h2 className="text-xl font-medium">Account Setting</h2>
          <Button
            className="btn-primary-mint hover:hover-btn-primary-mint w-[130px]"
            onClick={() => {
              toggle();
            }}
          >
            Edit <MdOutlineModeEdit size={18} className="ms-2" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-10 lg:ms-14 lg:gap-14">
          <div
            onClick={handleUploadAvatar}
            className="group relative flex h-[180px] w-[180px] flex-shrink-0 cursor-pointer items-center justify-center"
          >
            <img
              src={newAvatar || currentAvatar || DummyAvatar}
              alt="avatar"
              className="h-full w-full rounded-xl object-cover"
            />
            <div className="absolute inset-0 rounded-xl bg-black opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-50" />
            <input
              onChange={handleChangeImage}
              type="file"
              ref={inputFileRef}
              className="hidden"
              accept="image/jpeg, image/jpg, image/png"
            />
            {savingProfileImage && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50 backdrop-blur-sm
            "
              >
                <Spinner isFullWidthAndHeight={false} />
                <p className="text-sm">Saving...</p>
              </div>
            )}
            <button className="absolute hidden rounded-md border border-white bg-transparent px-5 py-2.5 text-sm backdrop-blur-[2.5px] group-hover:block">
              Change Picture
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {sanitizedProfileData.map((item, index) => (
              <div key={index} className="flex gap-3.5">
                <p className="w-32">{item?.label}</p>
                <p>:</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{item?.value}</p>
                  {item?.verified && (
                    <MdOutlineCheckCircleOutline
                      size={16}
                      className="text-rs-v2-mint"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal isShown={isShown} toggle={toggle} title="Update Account">
          <AccountForm toggle={toggle} data={userProfileData} />
        </Modal>
      </Card>
    </>
  );
};

export default AccountSetting;
