from handlers import RequestHandler
from models.company import get_companies_by_search_params

class CompanySearchHandler(RequestHandler):
    PATH = "/api/companies/search"

    async def get(self):
        company_name = self.get_argument('company_name', default="", strip=True)
        registration_code = self.get_argument('registration_code', default=0, strip=True)
        shareholder_name = self.get_argument('shareholder_name', default="", strip=True)
        shareholder_code = self.get_argument('shareholder_code', default=0, strip=True)

        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)
                
        if isinstance(registration_code, str) and shareholder_code.isnumeric():
            shareholder_code = int(shareholder_code)
        
        try:
            raw_company_list = await get_companies_by_search_params(
                company_name,
                registration_code,
                shareholder_name,
                shareholder_code
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH,
                message="Internal server error"
            )
        
        company_list = []
        for raw_company in raw_company_list:
            company_list.append({
                "registration_code": raw_company["registration_code"],
                "company_name": raw_company["company_name"]
            })

        return self.write_response(company_list)
