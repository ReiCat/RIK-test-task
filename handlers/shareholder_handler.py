import tornado

import settings
from handlers import RequestHandler
from datamodels.shareholder_data_model import ShareholderDataModel
from models.shareholder import delete_shareholder, update_shareholder


class ShareholderHandler(RequestHandler):
    PATH = "/api/companies/{registration_code}/shareholders/{shareholder_code}"

    async def put(self, registration_code: int, shareholder_code: int):
        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)

        if isinstance(shareholder_code, str) and shareholder_code.isnumeric():
            shareholder_code = int(shareholder_code)
        
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(registration_code=registration_code, shareholder_code=shareholder_code),
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        shareholder_type = request_payload.get('shareholder_type')
        if isinstance(shareholder_type, str) and shareholder_type.isnumeric():
            shareholder_type = int(shareholder_type)

        capital = request_payload.get('capital')
        if isinstance(capital, str) and capital.isnumeric():
            capital = int(capital)
        
        founder = request_payload.get('founder')

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
                path=self.PATH.format(registration_code=registration_code, shareholder_code=shareholder_code),
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
                path=self.PATH.format(registration_code=registration_code, shareholder_code=shareholder_code),
                message=message
            )
        
        if not update_shareholder:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(registration_code=registration_code, shareholder_code=shareholder_code),
                message="No shareholder found"
            )

        return self.write_response({
            "company_registration_code": updated_shareholder['company_registration_code'],
            "shareholder_code": updated_shareholder['shareholder_code'],
            "capital": updated_shareholder['capital'],
            "founder": updated_shareholder['founder'],
            "created_at": updated_shareholder["created_at"].strftime(settings.DT_FORMAT) if updated_shareholder.get("created_at") else None,
            "updated_at": updated_shareholder["updated_at"].strftime(settings.DT_FORMAT) if updated_shareholder.get("updated_at") else None
        })
        

    async def delete(
            self, 
            registration_code: int, 
            shareholder_code: int
        ):
        self.clear()

        if isinstance(registration_code, str) and registration_code.isnumeric():
            registration_code = int(registration_code)

        if isinstance(shareholder_code, str) and shareholder_code.isnumeric():
            shareholder_code = int(shareholder_code)
        
        try:
            await delete_shareholder(registration_code, shareholder_code)
        except Exception as e:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(registration_code=registration_code, shareholder_code=shareholder_code),
                message="Internal server error"
            )