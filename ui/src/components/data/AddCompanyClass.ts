import { SHAREHOLDER_TYPES } from "../../constants/enums"

export default class AddCompanyClass {
  company_name: string = "";
  registration_code: number = 0;
  founder_code: number = 0;
  founder_type: SHAREHOLDER_TYPES = SHAREHOLDER_TYPES.INDIVIDUAL;
  founder_capital: number = 0;
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return AddCompanyClass;
  }

  clone(): AddCompanyClass {
    const newCompanyClass = new AddCompanyClass();
    newCompanyClass.setValues(this);
    return newCompanyClass;
  }

  setValues(companyClass: AddCompanyClass) {
    this.company_name = companyClass.company_name;
    this.registration_code = companyClass.registration_code;
    this.created_at = companyClass.created_at;
    this.updated_at = companyClass.updated_at;
  }
}
