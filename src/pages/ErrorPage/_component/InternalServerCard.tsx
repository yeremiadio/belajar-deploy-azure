import { useNavigate } from 'react-router-dom';

import { AnAuthorized } from '@/assets/images';
import Datetime from '@/components/TopBar/_components/Datetime';
import { Button } from '@/components/ui/button';
import { loadCookie } from '@/services/cookie';
import { getDefaultRouteByUserTypeName } from '@/utils/functions/auth';

const InternalServerCard = () => {
  const navigate = useNavigate();
  // Redirect to default route by usertypeName after login
  const usertypeName = loadCookie('usertypeName');
  const route = getDefaultRouteByUserTypeName(usertypeName ?? '');

  return (
    <div className="flex h-full w-full flex-col px-3 py-3">
      <div className="ml-auto">
        {' '}
        <Datetime />
      </div>
      <div className="flex min-h-[80vh] flex-row flex-wrap items-center justify-center overflow-hidden">
        <div className="font-plus-jakarta-sans relative flex flex-col items-center justify-center">
          <img src={AnAuthorized} alt="copilot" width={300} height={300} />
          <p className="right-50 absolute top-[90px] text-6xl font-bold">500</p>
          <p className="absolute text-center text-lg uppercase">
            Sorry it’s not you, it’s us
          </p>
          <p className="absolute bottom-[130px] text-center text-xs">
            {`We’re experiencing an internal server problem, Please try again later.`}
          </p>
          <Button
            className="right-50 absolute bottom-20 rounded-lg bg-[#36E2D7] px-3 py-3 text-xs text-black"
            onClick={() => navigate(route, { replace: true })}
          >
            Back to Welcoming Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InternalServerCard;
