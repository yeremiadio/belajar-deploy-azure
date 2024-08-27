export type TModule = {
  id: number;
  name: string;
  permissions: {
    other: string[];
    dashboard: string[];
    management: string[];
  };
};
