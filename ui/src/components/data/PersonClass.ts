export default class PersonClass {
  personal_code: number = 0;
  first_name: string = "";
  last_name: string = "";
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
    this.personal_code = person.personal_code;
    this.first_name = person.first_name;
    this.last_name = person.last_name;
    this.created_at = person.created_at;
    this.updated_at = person.updated_at;
  }
}