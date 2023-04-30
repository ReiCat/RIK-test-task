import { SHAREHOLDER_TYPES } from "../../constants/enums"

export default class PersonClass {
  id: number = 0;
  company_registration_code: number = 0;
  shareholder_code: number = 0;
  shareholder_type: SHAREHOLDER_TYPES = SHAREHOLDER_TYPES.INDIVIDUAL;
  capital: number = 0;
  founder: boolean = false;
  created_at: string = "";
  updated_at: string = "";

  getConstructorFor(): any | null {
    return PersonClass;
  }

  clone(): PersonClass {
    const newPerson = new PersonClass();
    newPerson.setValues(this);
    return newPerson;
  }

  setValues(person: PersonClass) {
    this.id = person.id;
    this.company_registration_code = person.company_registration_code;
    this.shareholder_code = person.shareholder_code;
    this.shareholder_type = person.shareholder_type;
    this.capital = person.capital;
    this.founder = person.founder;
    this.created_at = person.created_at;
    this.updated_at = person.updated_at;
  }
}