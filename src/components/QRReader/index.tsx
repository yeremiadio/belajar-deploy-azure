import {
  useEffect,
  useRef,
  useState,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';
import QrScanner from 'qr-scanner';
import { QRFrame } from '@/assets/images';

interface Props {
  setScannedResult: Dispatch<SetStateAction<string>>;
}

const QRReader: FC<Props> = (props) => {
  const { setScannedResult } = props;

  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    setScannedResult(result?.data);
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        'Kamera terblokir atau tidak bisa diakses. Tolong ijikan kamera di browser anda dan reload.',
      );
  }, [qrOn]);

  return (
    <>
      <video style={{ width: '100%' }} ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img src={QRFrame} alt="Qr Frame" width={256} height={256} />
      </div>
    </>
  );
};

export default QRReader;
