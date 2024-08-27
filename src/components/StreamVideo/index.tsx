import { FC, HTMLAttributes, useCallback } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";

interface Props {
  stream_url: string;
}

export const StreamVideo: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  stream_url,
  ...rest
}) => {
  const cctvWebsocketRef = useCallback(
    (item: HTMLDivElement | null) => {
      if (item) {
        try {
          // eslint-disable-next-line
          let player = new JSMpeg.VideoElement(item, stream_url, {
            autoplay: true,
          });
          return player;

        } catch (error) {
          // return null;
        }
      }
    },
    [stream_url]
  );

  return <div ref={cctvWebsocketRef} {...rest} />;
  // return <div {...rest}></div>;
};
