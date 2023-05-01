export default class CompanyClass {
  company_name: string = "";
  registration_code: number = 0;
  total_capital: number = 0;
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return CompanyClass;
  }

  clone(): CompanyClass {
    const newCompanyClass = new CompanyClass();
    newCompanyClass.setValues(this);
    return newCompanyClass;
  }

  setValues(companyClass: CompanyClass) {
    this.company_name = companyClass.company_name;
    this.registration_code = companyClass.registration_code;
    this.created_at = companyClass.created_at;
    this.updated_at = companyClass.updated_at;
  }
}
