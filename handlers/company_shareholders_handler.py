import tornado

from handlers import RequestHandler
from datamodels.shareholder_data_model import ShareholderDataModel
from models.shareholder import get_shareholders_by_company_registration_code, insert_shareholder
from models.company import get_company_by_registration_code
from models.person import get_person_by_personal_code
from enums import SHAREHOLDER_TYPES

class CompanyShareholdersHandler(RequestHandler):
    PATH = "/api/companies/{registration_code}/shareholders"

    async def get(self, registration_code: int):
        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)

        try:
            raw_shareholder_list = await get_shareholders_by_company_registration_code(
                registration_code
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code),
                message="Internal server error"
            )
        
        shareholder_list = []
        for raw_shareholder in raw_shareholder_list:
            shareholder_list.append({
                "registration_code": raw_shareholder["registration_code"],
                "company_name": raw_shareholder["company_name"],
                "shareholder_first_name": raw_shareholder["first_name"] if raw_shareholder.get("first_name") else None,
                "shareholder_last_name": raw_shareholder["last_name"] if raw_shareholder.get("last_name") else None,
                "shareholder_company_name": raw_shareholder["shareholder_company_name"] if raw_shareholder.get("shareholder_company_name") else None,
                "shareholder_type": raw_shareholder["shareholder_type"],
                "shareholder_code": raw_shareholder["shareholder_code"],
                "shareholder_capital": raw_shareholder["shareholder_capital"],
                "founder": raw_shareholder["founder"],
                "created_at": self.extract_datetime(raw_shareholder["created_at"]),
                "updated_at": self.extract_datetime(raw_shareholder["updated_at"])
            })

        return self.write_response(shareholder_list)
    
    async def post(self, registration_code: int):
        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)
        
        raw_company = await get_company_by_registration_code(registration_code)
        if not raw_company:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code),
                message="No company found"
            )
        
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(registration_code=registration_code),
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        shareholder_code = request_payload.get('shareholder_code')
        if isinstance(shareholder_code, str) and shareholder_code.isnumeric():
            shareholder_code = int(shareholder_code)

        shareholder_type = request_payload.get('shareholder_type')
        if isinstance(shareholder_type, str) and shareholder_type.isnumeric():
            shareholder_type = int(shareholder_type)

        capital = request_payload.get('capital')
        if isinstance(capital, str) and capital.isnumeric():
            capital = int(capital)

        founder = request_payload.get('founder')

        if shareholder_type == SHAREHOLDER_TYPES.INDIVIDUAL:
            try:
                shareholder = await get_person_by_personal_code(
                    shareholder_code
                )
            except Exception as _:
                self.set_status(500)
                return self.write_error(
                    status_code=500,
                    path=self.PATH.format(registration_code=registration_code),
                    message="Internal server error"
                )
        else:
            try:
                shareholder = await get_company_by_registration_code(
                    shareholder_code
                )
            except Exception as _:
                self.set_status(500)
                return self.write_error(
                    status_code=500,
                    path=self.PATH.format(registration_code=registration_code),
                    message="Internal server error"
                )
            
        if not shareholder:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code),
                message="No shareholder found"
            )

        try:
            shareholder_data_model = ShareholderDataModel(
                company_registration_code=registration_code,
                shareholder_code=shareholder_code,
                shareholder_type=shareholder_type,
                capital=capital,
                founder=founder
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(registration_code=registration_code),
                message="Missing required arguments"
            )

        try:
            inserted_shareholder = await insert_shareholder(shareholder_data_model)
        except Exception as e:
            status_code = 500
            message = "Internal server error"

            if (
                hasattr(e, "message")
                and isinstance(e.message, str)
                and e.message.startswith(
                    'insert or update on table "shareholders"'
                )
            ):
                status_code = 400
                message = "No company or person found"

            if (
                hasattr(e, "message")
                and isinstance(e.message, str)
                and e.message.startswith(
                    "duplicate key value violates unique constraint"
                )
            ):
                status_code = 400
                message = "Shareholder with such params already exists"

            self.set_status(status_code)
            return self.write_error(
                status_code=status_code,
                path=self.PATH.format(registration_code=registration_code),
                message=message
            )

        self.set_status(201)
        return self.write_response({
            "company_registration_code": inserted_shareholder["company_registration_code"],
            "shareholder_code": inserted_shareholder["shareholder_code"],
            "shareholder_type": inserted_shareholder["shareholder_type"],
            "founder": inserted_shareholder["founder"],
            "capital": inserted_shareholder["capital"],
            "created_at": self.extract_datetime(inserted_shareholder["created_at"]),
            "updated_at": self.extract_datetime(inserted_shareholder["updated_at"])
        })