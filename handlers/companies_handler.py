import tornado
import settings

from handlers import RequestHandler
from datamodels.company_data_model import CompanyDataModel
from datamodels.shareholder_data_model import ShareholderDataModel
from models.company import insert_company
from models.person import get_person_by_personal_code
from models.shareholder import insert_shareholder

class CompaniesHandler(RequestHandler):
    PATH = "/api/companies"

    async def post(self):
        request_payload = tornado.escape.json_decode(self.request.body)
        company_name = request_payload.get('company_name')
        if len(company_name) > 0:
            company_name = company_name.strip()

        registration_code = request_payload.get('registration_code')
        if isinstance(registration_code, str) and len(registration_code) > 0:
            registration_code = registration_code.strip()

            try:
                registration_code = int(registration_code)
            except Exception as _:
                self.set_status(422)
                return self.write_error(
                    status_code=422,
                    path=self.PATH.format(registration_code=registration_code),
                    message="Registration code must contain only numbers"
                )

        founder_personal_code = request_payload.get('founder_personal_code')
        if isinstance(founder_personal_code, str) and len(founder_personal_code) > 0:
            founder_personal_code = founder_personal_code.strip()

            try:
                founder_personal_code = int(founder_personal_code)
            except Exception as _:
                self.set_status(422)
                return self.write_error(
                    status_code=422,
                    path=self.PATH.format(registration_code=registration_code),
                    message="Personal code must contain only numbers"
                )
            
        founder_capital = request_payload.get('founder_capital')
        if isinstance(founder_capital, str) and len(founder_capital) > 0:
            founder_capital = founder_capital.strip()

            try:
                founder_capital = int(founder_capital)
            except Exception as _:
                self.set_status(422)
                return self.write_error(
                    status_code=422,
                    path=self.PATH.format(registration_code=registration_code),
                    message="Founder capital must contain only numbers"
                )
        
        try:
            raw_person = await get_person_by_personal_code(
                founder_personal_code
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code),
                message="Internal server error"
            )
        
        if not raw_person:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code),
                message="No person found"
            )
        
        try:
            shareholder_data_model = ShareholderDataModel(
                company_registration_code=registration_code,
                shareholder_personal_code=founder_personal_code,
                capital=founder_capital,
                founder=True
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH,
                message="Missing required arguments"
            )

        try:
            company_data_model = CompanyDataModel(
                company_name=company_name,
                registration_code=registration_code,
                total_capital=founder_capital,
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH,
                message="Missing required arguments"
            )

        try:
            inserted_company = await insert_company(company_data_model)
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
        
        try:
            inserted_shareholder = await insert_shareholder(shareholder_data_model)
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
                message = "Shareholder with such params already exists"
            self.set_status(status_code)
            return self.write_error(
                status_code=status_code,
                path=self.PATH,
                message=message
            )

        self.set_status(201)
        return self.write_response({
            "registration_code": inserted_company['registration_code'],
            "company_name": inserted_company['company_name'],
            "total_capital": inserted_company['total_capital'],
            "createdAt": inserted_company["created_at"].strftime(settings.DT_FORMAT) if inserted_company.get("created_at") else None,
            "updated_at": inserted_company["updated_at"].strftime(settings.DT_FORMAT) if inserted_company.get("updated_at") else None
        })
