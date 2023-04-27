import settings

from handlers import RequestHandler
from models.company import get_company_by_registration_code

class CompanyHandler(RequestHandler):
    PATH = "/api/companies/{registration_code}"

    async def get(self, registration_code=int):
        self.clear()

        try:
            raw_company = await get_company_by_registration_code(registration_code)
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code),
                message="Internal server error"
            )
        
        return self.write_response({
            "registration_code": raw_company["registration_code"],
            "company_name": raw_company["company_name"],
            "total_capital": raw_company["total_capital"],
            "created_at": raw_company["created_at"].strftime(settings.DT_FORMAT) if raw_company["created_at"] else None,
            "updated_at": raw_company["updated_at"].strftime(settings.DT_FORMAT) if raw_company["updated_at"] else None
        })
