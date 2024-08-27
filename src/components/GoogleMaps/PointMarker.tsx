import { FC, useEffect, useState } from 'react';
import {
  OverlayView,
  OverlayViewF,
  OverlayViewProps,
} from '@react-google-maps/api';
import { MdOutlineCheckCircle } from 'react-icons/md';

import { cn } from '@/lib/utils';

type Props = {
  isOverThreshold?: boolean;
  children?: React.ReactNode;
  isActive?: boolean;
  useBigMarker?: boolean;
  isWarning?: boolean;
  isConfirmedAlert?: boolean;
  className?: string;
  forceShowDetail?: boolean;
  useBigMarkerOnShowDetail?: boolean;
  additionalAction?: () => void;
};

export const PointMarker: FC<Props & Partial<OverlayViewProps>> = ({
  position,
  children,
  isOverThreshold,
  isActive = true,
  useBigMarker = false,
  isWarning,
  isConfirmedAlert,
  className,
  forceShowDetail,
  useBigMarkerOnShowDetail = false,
  additionalAction,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleClickMarker = () => {
    setShowDetail((prev) => !prev);

    if (additionalAction) {
      additionalAction();
    }
  };

  useEffect(() => {
    if (typeof forceShowDetail === 'boolean') {
      setShowDetail(forceShowDetail);
    }
  }, [forceShowDetail]);

  return (
    <OverlayViewF
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      {isOverThreshold && (
        <div
          className={cn(
            'absolute h-3 w-3 animate-ping rounded-full bg-rs-v2-red',
            useBigMarker && 'h-5 w-5',
            useBigMarkerOnShowDetail && showDetail && 'h-5 w-5',
          )}
        />
      )}
      <div
        className={cn(
          'relative flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-rs-alert-green transition-all ease-in-out',
          isWarning && 'bg-rs-alert-yellow',
          isOverThreshold && 'bg-rs-v2-red',
          !isActive && 'bg-rs-neutral-dark-platinum',
          showDetail &&
            'border-[1px] border-white shadow-[0_0_16px_rgba(255,255,255,.7)]',
          useBigMarker && 'h-5 w-5',
          useBigMarkerOnShowDetail && showDetail && 'h-5 w-5',
          className,
        )}
        onClick={handleClickMarker}
      >
        {isConfirmedAlert && (
          <MdOutlineCheckCircle
            className={cn(
              useBigMarker && 'h-5 w-5',
              !useBigMarker && 'h-3 w-3',
            )}
          />
        )}
        {showDetail && children}
      </div>
    </OverlayViewF>
  );
};
