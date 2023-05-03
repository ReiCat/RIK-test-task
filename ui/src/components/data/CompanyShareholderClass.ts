import { SHAREHOLDER_TYPES } from "../../constants/constants"

export default class CompanyShareholderClass {
  id: number = 0;
  registration_code: number = 0;
  company_name: string = "";
  shareholder_first_name: string = "";
  shareholder_last_name: string = "";
  shareholder_company_name: string = "";
  shareholder_code: number = 0;
  shareholder_type: SHAREHOLDER_TYPES = SHAREHOLDER_TYPES.INDIVIDUAL;
  shareholder_capital: number = 0;
  founder: boolean = false;
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return CompanyShareholderClass;
  }

  clone(): CompanyShareholderClass {
    const newCompanyShareholderClass = new CompanyShareholderClass();
    newCompanyShareholderClass.setValues(this);
    return newCompanyShareholderClass;
  }

  setValues(person: CompanyShareholderClass) {
    this.id = person.id;
    this.registration_code = person.registration_code;
    this.shareholder_code = person.shareholder_code;
    this.shareholder_type = person.shareholder_type;
    this.shareholder_capital = person.shareholder_capital;
    this.founder = person.founder;
    this.created_at = person.created_at;
    this.updated_at = person.updated_at;
  }
}
