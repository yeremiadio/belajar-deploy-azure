import { BasicSelectOpt } from '@/types/global';

type Props = BasicSelectOpt<string> & {
  vendor: string;
};

const licensePlateOptionsDummy: Props[] = [
  {
    label: 'AD 1510 BA',
    value: 'AD 1510 BA',
    vendor: 'PT. Jaya Sakti',
  },
  {
    label: 'S 7849 NU',
    value: 'S 7849 NU',
    vendor: 'PT. Jaya Sakti',
  },
  {
    label: 'L 2385 LK',
    value: 'L 2385 LK',
    vendor: 'PT. Jaya Sakti',
  },
  {
    label: 'BP 12394 MM',
    value: 'BP 12394 MM',
    vendor: 'PT Nusantara',
  },
  {
    label: 'S 6347 KD',
    value: 'S 6347 KD',
    vendor: 'PT Nusantara',
  },
  {
    label: 'AB 7537 WN',
    value: 'AB 7537 WN',
    vendor: 'PT Nusantara',
  },
  {
    label: 'BP 9985 HJ',
    value: 'BP 9985 HJ',
    vendor: 'PT Membangun ID',
  },
  {
    label: 'KT 5643 UY',
    value: 'KT 5643 UY',
    vendor: 'PT Membangun ID',
  },
  {
    label: 'B 2342 NJU',
    value: 'B 2342 NJU',
    vendor: 'PT Membangun ID',
  },
];

export default licensePlateOptionsDummy;
