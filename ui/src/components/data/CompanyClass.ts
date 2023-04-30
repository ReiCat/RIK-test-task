export default class CompanyClass {
  company_name: string = "";
  registration_code: number = 0;
  shareholder_name: string = "";
  shareholder_code: number = 0;

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
    this.shareholder_name = companyClass.shareholder_name;
    this.shareholder_code = companyClass.shareholder_code;
  }
}
