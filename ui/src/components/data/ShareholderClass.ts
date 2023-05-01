import { SHAREHOLDER_TYPES } from "../../constants/enums"

export default class ShareholderClass {
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
    return ShareholderClass;
  }

  clone(): ShareholderClass {
    const newPerson = new ShareholderClass();
    newPerson.setValues(this);
    return newPerson;
  }

  setValues(person: ShareholderClass) {
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

// "registration_code": raw_shareholder["registration_code"],
// "company_name": raw_shareholder["company_name"],
// "shareholder_first_name": raw_shareholder["first_name"] if raw_shareholder.get("first_name") else None,
// "shareholder_last_name": raw_shareholder["last_name"] if raw_shareholder.get("last_name") else None,
// "shareholder_company_name": raw_shareholder["shareholder_company_name"] if raw_shareholder.get("shareholder_company_name") else None,
// "shareholder_type": raw_shareholder["shareholder_type"],
// "shareholder_code": raw_shareholder["shareholder_code"],
// "founder": raw_shareholder["founder"],
// "created_at": raw_shareholder["created_at"],
// "updated_at": raw_shareholder["updated_at"]