
export default class ShareholderClass {
  id: number = 0;
  company_registration_code: number = 0;
  company_name: string = "";
  capital: number = 0;
  founder: boolean = false;
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return ShareholderClass;
  }

  clone(): ShareholderClass {
    const newShareholderClass = new ShareholderClass();
    newShareholderClass.setValues(this);
    return newShareholderClass;
  }

  setValues(person: ShareholderClass) {
    this.id = person.id;
    this.company_registration_code = person.company_registration_code;
    this.company_name = person.company_name;
    this.capital = person.capital;
    this.founder = person.founder;
    this.created_at = person.created_at;
    this.updated_at = person.updated_at;
  }
}
