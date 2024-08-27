import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const WebSocketTestLazy = lazy(
  () => import('@/pages/WebSocketTest/WebSocketTestPage'),
);

const WebSocketTesPage = () => {
  return <Lazyload component={WebSocketTestLazy} />;
};

export default WebSocketTesPage;
