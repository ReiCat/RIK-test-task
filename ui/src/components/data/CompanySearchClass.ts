export default class CompanySearchClass {
  company_name: string = "";
  registration_code: number = 0;
  shareholder_name: string = "";
  shareholder_code: number = 0;

  getConstructorFor(): any | null {
    return CompanySearchClass;
  }

  clone(): CompanySearchClass {
    const newCompanySearchClass = new CompanySearchClass();
    newCompanySearchClass.setValues(this);
    return newCompanySearchClass;
  }

  setValues(companyClass: CompanySearchClass) {
    this.company_name = companyClass.company_name;
    this.registration_code = companyClass.registration_code;
    this.shareholder_name = companyClass.shareholder_name;
    this.shareholder_code = companyClass.shareholder_code;
  }

  toJSON() {
    return {
      company_name: this.company_name,
      registration_code: this.registration_code,
      shareholder_name: this.shareholder_name,
      shareholder_code: this.shareholder_code,
    }
  }
}
