export type TProduct = {
  id: number;
  name: string;
  uniqueId: string;
  companyId: number;
  type: string;
  unit: string;
  price: number;
  stock: number;
};

export interface TProductOrderFormObject {
  productId: string;
  endDate: Date;
  startDate: Date;
  productName: string;
  qty: number;
  status: string;
  factory: string;
  machine: string;
  unit: string;
}
// type TCompany = {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   name: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
// };

// type TGroup = {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   name: string;
//   isShow: boolean;
//   companyId: number;
// };

// type TGroupItem = {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   price: number;
//   group: TGroup;
// };

// export type TProductV2 = {
//   id: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   name: string;
//   uniqueId: string;
//   companyId: number;
//   type: string;
//   unit: string;
//   price: number;
//   stock: number;
//   company: TCompany;
//   group: TGroupItem[];
// };
