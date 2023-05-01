import * as Api from "./api-client";
import CompanyClass from "../components/data/CompanyClass";
import CompanySearchClass from "../components/data/CompanySearchClass";
import PersonClass from "../components/data/PersonClass";
import ShareholderClass from "../components/data/ShareholderClass";
import AddCompanyClass from "../components/data/AddCompanyClass";
import * as ApiPaths from "../constants/apiPaths";

export async function fetchCompanies(): Promise<CompanyClass[]> {
  return await Api.get(ApiPaths.PATH_COMPANIES, CompanyClass);
};

export async function addCompany(newCompany: AddCompanyClass): Promise<AddCompanyClass> {
  return await Api.post<AddCompanyClass>(ApiPaths.PATH_COMPANIES, newCompany);
};

export async function fetchCompany(registration_code: number): Promise<CompanyClass> {
  return await Api.get<CompanyClass>(`${ApiPaths.PATH_COMPANIES}/${registration_code}`);
};

export async function updateCompany(registration_code: number, company: CompanyClass): Promise<CompanyClass> {
  return await Api.put<PersonClass>(`${ApiPaths.PATH_COMPANIES}/${registration_code}`, company);
};

export async function deleteCompany(registration_code: number): Promise<number> {
  return await Api.del<number>(`${ApiPaths.PATH_COMPANIES}/${registration_code}`);
};

export async function searchCompanies(companySearch: CompanySearchClass): Promise<CompanyClass[]> {
  const companySearchObj = JSON.parse(JSON.stringify(companySearch))

  const params = new URLSearchParams();

  for (const key in companySearchObj) {
    if (companySearch.hasOwnProperty(key)) {
      params.append(key, companySearchObj[key]);
    }
  }

  return await Api.get<CompanyClass[]>(`${ApiPaths.PATH_COMPANIES_SEARCH}?${params}`);
};

export async function fetchPersons(): Promise<PersonClass[]> {
  return await Api.get(ApiPaths.PATH_PERSONS, PersonClass);
};

export async function addPerson(person: PersonClass): Promise<PersonClass> {
  return await Api.post<PersonClass>(ApiPaths.PATH_PERSONS, person);
};

export async function fetchPerson(personal_code: number): Promise<PersonClass> {
  return await Api.get<PersonClass>(`${ApiPaths.PATH_PERSONS}/${personal_code}`);
};

export async function updatePerson(person: PersonClass): Promise<PersonClass> {
  return await Api.put<PersonClass>(`${ApiPaths.PATH_PERSONS}/${person.personal_code}`, person);
};

export async function deletePerson(personal_code: number): Promise<number> {
  return await Api.del<number>(`${ApiPaths.PATH_PERSONS}/${personal_code}`);
};

export async function addCompanyShareholder(shareholder: ShareholderClass): Promise<ShareholderClass> {
  return await Api.post<ShareholderClass>(`${ApiPaths.PATH_COMPANIES}/${shareholder.registration_code}/shareholders`, shareholder);
};

export async function fetchCompanyShareholders(registration_code: number): Promise<ShareholderClass[]> {
  return await Api.get(`${ApiPaths.PATH_COMPANIES}/${registration_code}/shareholders`, ShareholderClass);
};

export async function updateCompanyShareholder(shareholder: ShareholderClass): Promise<PersonClass> {
  return await Api.put<PersonClass>(`${ApiPaths.PATH_COMPANIES}/${shareholder.registration_code}/shareholders/${shareholder.shareholder_code}`, shareholder);
};

export async function deleteCompanyShareholder(company_registration_code: number, shareholder_code: number): Promise<number> {
  return await Api.del<number>(`${ApiPaths.PATH_COMPANIES}/${company_registration_code}/shareholders/${shareholder_code}`);
};
