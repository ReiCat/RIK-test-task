export default class PersonAddClass {
  personal_code: number = 0;
  first_name: string = "";
  last_name: string = "";

  getConstructorFor(): any | null {
    return PersonAddClass;
  }

  clone(): PersonAddClass {
    const newPersonAddClass = new PersonAddClass();
    newPersonAddClass.setValues(this);
    return newPersonAddClass;
  }

  setValues(person: PersonAddClass) {
    this.personal_code = person.personal_code;
    this.first_name = person.first_name;
    this.last_name = person.last_name;
  }
}