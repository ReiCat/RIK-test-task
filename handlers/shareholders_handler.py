import tornado

import settings
from handlers import RequestHandler
from datamodels.shareholder_data_model import ShareholderDataModel
from models.shareholder import (
    get_shareholders_by_company_registration_code, 
    insert_shareholder, 
    delete_shareholder, 
    update_shareholder
)

class ShareholdersHandler(RequestHandler):
    PATH = "/api/shareholders/{company_registration_code}"

    async def get(self, company_registration_code: int):
        self.clear()

        try:
            company_registration_code = int(company_registration_code)
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required params"
            )

        try:
            raw_shareholder_list = await get_shareholders_by_company_registration_code(
                company_registration_code
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Internal server error"
            )
        
        shareholder_list = []
        for raw_shareholder in raw_shareholder_list:
            shareholder_list.append({
                "company_registration_code": raw_shareholder["company_registration_code"],
                "first_name": raw_shareholder["first_name"],
                "last_name": raw_shareholder["last_name"],
                "shareholder_personal_code": raw_shareholder["shareholder_personal_code"],
                "founder": raw_shareholder["founder"],
                "created_at": raw_shareholder["created_at"],
                "updated_at": raw_shareholder["updated_at"]
            })

        return self.write_response(shareholder_list)
    
    async def post(self, company_registration_code: int):
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        shareholder_personal_code = request_payload.get('shareholder_personal_code')
        capital = request_payload.get('capital')
        founder = request_payload.get('founder')

        try:
            shareholder_data_model = ShareholderDataModel(
                company_registration_code=company_registration_code,
                shareholder_personal_code=shareholder_personal_code,
                capital=capital,
                founder=founder
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
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
                path=self.PATH.format(company_registration_code=company_registration_code),
                message=message
            )

        self.set_status(201)
        return self.write_response({
            "company_registration_code": inserted_shareholder['company_registration_code'],
            "shareholder_personal_code": inserted_shareholder['shareholder_personal_code'],
            "capital": inserted_shareholder['capital'],
            "founder": inserted_shareholder['founder'],
            "createdAt": inserted_shareholder["created_at"].strftime(settings.DT_FORMAT) if inserted_shareholder.get("created_at") else None,
            "updated_at": inserted_shareholder["updated_at"].strftime(settings.DT_FORMAT) if inserted_shareholder.get("updated_at") else None
        })
        
    async def delete(self, company_registration_code: int):
        try:
            company_registration_code = int(company_registration_code)
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required arguments"
            )
        
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        shareholder_personal_code = request_payload.get('shareholder_personal_code')
        if not shareholder_personal_code:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required arguments"
            )
        
        try:
            await delete_shareholder(
                company_registration_code, 
                shareholder_personal_code
            )
        except Exception as e:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Internal server error"
            )
    
    async def put(self, company_registration_code: int):
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        shareholder_personal_code = request_payload.get('shareholder_personal_code')
        capital = request_payload.get('capital')
        founder = request_payload.get('founder')

        try:
            shareholder_data_model = ShareholderDataModel(
                company_registration_code=company_registration_code,
                shareholder_personal_code=shareholder_personal_code,
                capital=capital,
                founder=founder
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(company_registration_code=company_registration_code),
                message="Missing required arguments"
            )

        try:
            updated_shareholder = await update_shareholder(shareholder_data_model)
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
                path=self.PATH.format(company_registration_code=company_registration_code),
                message=message
            )
        
        if not update_shareholder:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=company_registration_code),
                message="No shareholder found"
            )

        return self.write_response({
            "company_registration_code": updated_shareholder['company_registration_code'],
            "shareholder_personal_code": updated_shareholder['shareholder_personal_code'],
            "capital": updated_shareholder['capital'],
            "founder": updated_shareholder['founder'],
            "createdAt": updated_shareholder["created_at"].strftime(settings.DT_FORMAT) if updated_shareholder.get("created_at") else None,
            "updated_at": updated_shareholder["updated_at"].strftime(settings.DT_FORMAT) if updated_shareholder.get("updated_at") else None
        })