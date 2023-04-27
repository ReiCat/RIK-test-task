from handlers import RequestHandler
from models.shareholder import get_shareholder_by_personal_code


class ShareholderHandler(RequestHandler):
    PATH = "/api/shareholders/{personal_code}"

    async def get(self, personal_code: int):
        self.clear()

        try:
            raw_shareholder = await get_shareholder_by_personal_code(personal_code)
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH,
                message="Internal server error"
            )

        return self.write_response({
            "company_registration_code": raw_shareholder["company_registration_code"],
            "first_name": raw_shareholder["first_name"],
            "last_name": raw_shareholder["last_name"],
            "personal_code": raw_shareholder["personal_code"],
            "founder": raw_shareholder["founder"],
            "created_at": raw_shareholder["created_at"],
            "updated_at": raw_shareholder["updated_at"]
        })
