from handlers import RequestHandler
from models.shareholder import get_companies_by_shareholder_code_and_type
from enums import SHAREHOLDER_TYPES


class PersonSharesHandler(RequestHandler):
    PATH = "/api/persons/{personal_code}/shareholders"

    async def get(self, personal_code: int):
        self.clear()

        if isinstance(personal_code, str) and personal_code.isnumeric():
            personal_code = int(personal_code)

        try:
            raw_shareholder_list = await get_companies_by_shareholder_code_and_type(
                personal_code,
                SHAREHOLDER_TYPES.INDIVIDUAL
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(personal_code=personal_code),
                message="Internal server error"
            )
        
        shareholder_list = []
        for raw_shareholder in raw_shareholder_list:
            shareholder_list.append({
                "company_registration_code": raw_shareholder["company_registration_code"],
                "company_name": raw_shareholder["company_name"],
                "capital": raw_shareholder["capital"],
                "founder": raw_shareholder["founder"],
                "created_at": self.extract_datetime(raw_shareholder["created_at"]),
                "updated_at": self.extract_datetime(raw_shareholder["updated_at"])
            })

        return self.write_response(shareholder_list)
