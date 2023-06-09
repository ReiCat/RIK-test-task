import tornado
import settings
from datetime import datetime

from handlers import RequestHandler
from datamodels.company_data_model import CompanyDataModel
from models.company import get_company_by_registration_code, update_company, delete_company

class CompanyHandler(RequestHandler):
    PATH = "/api/companies/{registration_code}"

    async def get(self, registration_code: int):
        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)

        try:
            raw_company = await get_company_by_registration_code(registration_code)
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code),
                message="Internal server error"
            )
        
        if not raw_company:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code),
                message="No company found"
            )
        
        return self.write_response({
            "registration_code": raw_company["registration_code"],
            "company_name": raw_company["company_name"],
            "total_capital": raw_company["total_capital"],
            "created_at": self.extract_datetime(raw_company.get("created_at")),
            "updated_at": self.extract_datetime(raw_company.get("updated_at"))
        })

    async def put(self, registration_code: int):
        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)
        
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(registration_code=registration_code),
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        company_name = request_payload.get('company_name')
        new_registration_code = request_payload.get('registration_code')
        created_at = request_payload.get('created_at')

        if created_at:
            created_at = datetime.strptime(created_at, settings.DT_FORMAT)

        if isinstance(new_registration_code, str) and new_registration_code.isnumeric():
            new_registration_code = int(new_registration_code)
        
        try:
            raw_company = await get_company_by_registration_code(registration_code)
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code),
                message="Internal server error"
            )
        
        if not raw_company:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code),
                message="No company found"
            )

        try:
            company_data_model = CompanyDataModel(
                registration_code=new_registration_code,
                company_name=company_name,
                created_at=created_at
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(registration_code=registration_code),
                message="Missing required arguments"
            )

        try:
            updated_company = await update_company(
                registration_code, 
                company_data_model
            )
        except Exception as e:
            status_code = 500
            message = "Internal server error"
            if (
                hasattr(e, "message")
                and isinstance(e.message, str)
                and e.message.startswith(
                    "duplicate key value violates unique constraint"
                )
            ):
                status_code = 400
                message = "Company with such params already exists"
            self.set_status(status_code)
            return self.write_error(
                status_code=status_code,
                path=self.PATH.format(registration_code=registration_code),
                message=message
            )
        
        if not updated_company:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code),
                message="No company found"
            )

        return self.write_response({
            "registration_code": updated_company['registration_code'],
            "company_name": updated_company['company_name'],
            "total_capital": updated_company['total_capital'],
            "created_at": self.extract_datetime(updated_company.get("created_at")),
            "updated_at": self.extract_datetime(updated_company.get("updated_at"))
        })

    async def delete(self, registration_code: int):
        self.clear()
        
        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)

        try:
            await delete_company(registration_code)
        except Exception as e:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code),
                message="Internal server error"
            )