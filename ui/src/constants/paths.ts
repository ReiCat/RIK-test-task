export enum LINK_PATHS {
  homePage = "/",
  persons = "/persons",
  personDetails = "/companies/:personalCode",
  companies = "/companies",
  companyDetails = "/companies/:registrationCode",
  companiesSearch = "/companies/search",
  shareholders = "/companies/:registrationCode/shareholders",
  shareholderDetails = "/companies/:registrationCode/shareholders",
  notFound = "/not-found",
}