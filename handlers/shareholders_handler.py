import settings
from handlers import RequestHandler
from models.shareholder import get_shareholder_list_by_company_registration_code

class ShareholdersHandler(RequestHandler):
    PATH = "/api/shareholders{company_registration_code}"

    async def get(self, company_registration_code: int):
        self.clear()

        try:
            raw_shareholder_list_list = await get_shareholder_list_by_company_registration_code(company_registration_code)
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH,
                message="Internal server error"
            )
        
        shareholder_list = []
        for raw_shareholder in raw_shareholder_list_list:
            shareholder_list.append({
                "company_registration_code": raw_shareholder["company_registration_code"],
                "first_name": raw_shareholder["first_name"],
                "last_name": raw_shareholder["last_name"],
                "personal_code": raw_shareholder["personal_code"],
                "founder": raw_shareholder["founder"],
                "created_at": raw_shareholder["created_at"],
                "updated_at": raw_shareholder["updated_at"]
            })

        return self.write_response(shareholder_list)