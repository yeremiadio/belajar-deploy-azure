import Card from '@/components/Card';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';

import { useModal } from '@/utils/hooks/useModal';

import PasswordForm from '../PasswordForm';

const PasswordSetting = () => {
  const { isShown, toggle } = useModal();

  return (
    <>
      <Card className="mb-5 h-fit px-5 pb-10 pt-5">
        <div className="mb-5 flex items-center justify-between gap-5">
          <h2 className="text-xl font-medium">Password Setting</h2>
          <Button
            className="btn-primary-mint hover:hover-btn-primary-mint w-[130px]"
            onClick={() => {
              toggle();
            }}
          >
            Update Password
          </Button>
        </div>
        <div className="lg:ms-14">
          <div className="flex items-center gap-3.5">
            <p className="w-32">Password</p>
            <p>:</p>
            <p className="font-semibold">************************</p>
          </div>
        </div>
      </Card>
      <Modal isShown={isShown} toggle={toggle} title="Update Password">
        <PasswordForm toggle={toggle} />
      </Modal>
    </>
  );
};

export default PasswordSetting;
