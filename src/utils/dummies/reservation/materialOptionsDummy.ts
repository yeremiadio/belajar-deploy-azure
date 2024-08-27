import { BasicSelectOpt } from '@/types/global';

export type TMaterialOpt = BasicSelectOpt<number> & {
  name: string;
  unit: string;
  partNo: string;
  cost: number;
  amount: number;
  availability: number;
  stock: number;
  status: string;
  id: number;
};

const materialOptionsDummy: TMaterialOpt[] = [
  {
    label: 1,
    value: 1,
    id: 1,
    name: 'Urea',
    unit: 'Kg',
    partNo: 'PC-11127346',
    cost: 150000000,
    amount: 70,
    availability: 10000,
    stock: 8800,
    status: 'ready',
  },
  {
    label: 2,
    value: 2,
    id: 2,
    name: 'SP-36 (Super Phosphate)',
    unit: 'Kg',
    partNo: 'PC-2227346',
    cost: 160000000,
    amount: 10,
    availability: 82000,
    stock: 4400,
    status: 'ready',
  },
  {
    label: 3,
    value: 3,
    id: 3,
    name: 'KCl (Kalium Klorida)',
    unit: 'Kg',
    stock: 3300,
    partNo: 'PC-33327346',
    cost: 600000000,
    amount: 20,
    availability: 10300,
    status: 'ready',
  },
];

export default materialOptionsDummy;
