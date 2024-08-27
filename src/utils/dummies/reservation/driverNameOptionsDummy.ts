import { BasicSelectOpt } from '@/types/global';

type Props = BasicSelectOpt<string> & {
  vendor: string;
};

const driveNameOptionsDummy: Props[] = [
  {
    label: 'Muhammad Setyo Budi',
    value: 'Muhammad Setyo Budi',
    vendor: 'PT. Jaya Sakti',
  },
  {
    label: 'Nugroho Irwan Pras',
    value: 'Nugroho Irwan Pras',
    vendor: 'PT. Jaya Sakti',
  },
  {
    label: 'Agus Sujatmiko',
    value: 'Agus Sujatmiko',
    vendor: 'PT. Jaya Sakti',
  },
  {
    label: 'Hariyanto Wibowo',
    value: 'Hariyanto Wibowo',
    vendor: 'PT Nusantara',
  },
  {
    label: 'Nuri Yislam',
    value: 'Nuri Yislam',
    vendor: 'PT Nusantara',
  },
  {
    label: 'Heru Prasetyo',
    value: 'Heru Prasetyo',
    vendor: 'PT Nusantara',
  },
  {
    label: 'Herlambang Aditya',
    value: 'Herlambang Aditya',
    vendor: 'PT Membangun ID',
  },
  {
    label: 'Nur Helmi',
    value: 'Nur Helmi',
    vendor: 'PT Membangun ID',
  },
  {
    label: 'Norman Kamil',
    value: 'Norman Kamil',
    vendor: 'PT Membangun ID',
  },
];

export default driveNameOptionsDummy;
