import settings
from handlers import RequestHandler
from models.shareholder import get_shareholder_list_by_company_registration_code

class ShareholderHandler(RequestHandler):
    async def get(self):
        self.clear()

        try:
            raw_company_list = await get_shareholder_list_by_company_registration_code()
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