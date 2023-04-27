import tornado

import settings
from handlers import RequestHandler
from classes.dependency import D
from models.company import get_company_list_by_search_params

class CompanySearchHandler(RequestHandler):
    PATH = "/api/search"

    async def get(self):
        company_name = self.get_argument('company_name', default="", strip=True)
        registration_code = self.get_argument('registration_code', default=0, strip=True)
        shareholder_name = self.get_argument('shareholder_name', default="", strip=True)
        shareholder_personal_code = self.get_argument('shareholder_personal_code', default=0, strip=True)

        self.clear()

        try:
            registration_code = int(registration_code)
        except ValueError:
            self.set_status(422)
            return self.write_error(
                status_code=422,
                path=self.PATH,
                message="Unprocessable Content"
            )
        
        try:
            shareholder_personal_code = int(shareholder_personal_code)
        except ValueError:
            self.set_status(422)
            return self.write_error(
                status_code=422,
                path=self.PATH,
                message="Unprocessable Content"
            )
        
        try:
            raw_company_list = await get_company_list_by_search_params(
                company_name,
                registration_code,
                shareholder_name,
                shareholder_personal_code
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH,
                message="Internal server error"
            )
        
        dt_format = settings.DT_FORMAT
        
        company_list = []
        for raw_company in raw_company_list:
            company_list.append({
                "registration_code": raw_company["registration_code"],
                "company_name": raw_company["company_name"],
                "total_capital": raw_company["total_capital"],
                "created_at": raw_company["created_at"].strftime(dt_format) if raw_company["created_at"] else None,
                "updated_at": raw_company["updated_at"].strftime(dt_format) if raw_company["updated_at"] else None
            })

        return self.write_response(company_list)

    async def post(self):
        pass