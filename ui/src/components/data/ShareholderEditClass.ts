import { SHAREHOLDER_TYPES } from "../../constants/enums"

export default class ShareholderEditClass {
  registration_code: number = 0;
  shareholder_code: number = 0;
  shareholder_type: SHAREHOLDER_TYPES = SHAREHOLDER_TYPES.INDIVIDUAL;
  capital: number = 0;
  founder: boolean = false;
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return ShareholderEditClass;
  }

  clone(): ShareholderEditClass {
    const newShareholderAddClass = new ShareholderEditClass();
    newShareholderAddClass.setValues(this);
    return newShareholderAddClass;
  }

  setValues(shareholderAddClass: ShareholderEditClass) {
    this.registration_code = shareholderAddClass.registration_code;
    this.shareholder_code = shareholderAddClass.shareholder_code;
    this.shareholder_type = shareholderAddClass.shareholder_type;
    this.capital = shareholderAddClass.capital;
    this.founder = shareholderAddClass.founder;
    this.created_at = shareholderAddClass.created_at;
    this.updated_at = shareholderAddClass.updated_at;
  }
}

type Option = {
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