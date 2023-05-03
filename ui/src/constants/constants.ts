export enum SHAREHOLDER_TYPES {
  INDIVIDUAL = 1,
  LEGAL = 2,
}

export type Option = {
  [value: string]: any;
};

export const ShareholderTypeOptions: Option[] = [
  {
    value: 1,
    name: "Individual",
  },
  {
    value: 2,
    name: "Legal",
  },
];