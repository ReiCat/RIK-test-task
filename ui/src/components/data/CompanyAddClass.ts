import { SHAREHOLDER_TYPES } from "../../constants/constants"

export default class CompanyAddClass {
  company_name: string = "";
  registration_code: string = "";
  founder_code: string = "";
  founder_type: SHAREHOLDER_TYPES = SHAREHOLDER_TYPES.INDIVIDUAL;
  founder_capital: string = "";
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return CompanyAddClass;
  }

  clone(): CompanyAddClass {
    const newCompanyAddClass = new CompanyAddClass();
    newCompanyAddClass.setValues(this);
    return newCompanyAddClass;
  }

  setValues(companyClass: CompanyAddClass) {
    this.company_name = companyClass.company_name;
    this.registration_code = companyClass.registration_code;
    this.created_at = companyClass.created_at;
    this.updated_at = companyClass.updated_at;
  }
}
