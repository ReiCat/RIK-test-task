import tornado
import settings

from handlers import RequestHandler
from classes.dependency import D
from datamodels.company_data_model import CompanyDataModel
from models.company import get_company_list_by_search_params, insert_company

class CompanyHandler(RequestHandler):
    PATH = "/api/company"

    async def get(self):
        self.clear()

        try:
            raw_company_list = await get_company_list_by_search_params()
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
        request_payload = tornado.escape.json_decode(self.request.body)
        company_name = request_payload.get('company_name')
        if len(company_name) > 0:
            company_name = company_name.strip()

        registration_code = request_payload.get('registration_code')
        if len(registration_code) > 0:
            registration_code = registration_code.strip()

        shareholder_personal_code = request_payload.get('shareholder_personal_code')
        if len(shareholder_personal_code) > 0:
            shareholder_personal_code = shareholder_personal_code.strip()

        try:
            account_data_model = CompanyDataModel(
                company_name=company_name,
                registration_code=registration_code
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH,
                message="Missing required arguments"
            )

        try:
            inserted_company = await insert_company(account_data_model)
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
                path=self.PATH,
                message=message
            )

        dt_format = settings.DT_FORMAT

        self.set_status(201)
        return self.write_response({
            "registration_code": inserted_company['registration_code'],
            "company_name": inserted_company['company_name'],
            "total_capital": inserted_company['lastname'],
            "createdAt": inserted_company["created_at"].strftime(dt_format) if inserted_company["created_at"] else None,
            "updated_at": inserted_company["updated_at"].strftime(dt_format) if inserted_company["updated_at"] else None
        })
