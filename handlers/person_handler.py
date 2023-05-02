import tornado

from handlers import RequestHandler
from datamodels.person_data_model import PersonDataModel
from models.person import (
    get_person_by_personal_code, 
    delete_person, 
    update_person
)

class PersonHandler(RequestHandler):
    PATH = "/api/persons/{personal_code}"

    async def get(self, personal_code: int):
        self.clear()

        if isinstance(personal_code, str) and personal_code.isnumeric():
            personal_code = int(personal_code)

        try:
            raw_person = await get_person_by_personal_code(
                personal_code
            )
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(personal_code=personal_code),
                message="Internal server error"
            )
        
        if not raw_person:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(personal_code=personal_code),
                message="No person found"
            )
        
        return self.write_response({
                "personal_code": raw_person["personal_code"],
                "first_name": raw_person["first_name"],
                "last_name": raw_person["last_name"],
                "created_at": self.extract_datetime(raw_person["created_at"]),
                "updated_at": self.extract_datetime(raw_person["updated_at"])
            })

    async def put(self, personal_code: int):
        self.clear()

        if isinstance(personal_code, str) and personal_code.isnumeric():
            personal_code = int(personal_code)
        
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH,
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        new_personal_code = request_payload.get('personal_code')
        first_name = request_payload.get('first_name')
        last_name = request_payload.get('last_name')

        try:
            person_data_model = PersonDataModel(
                personal_code=new_personal_code,
                first_name=first_name,
                last_name=last_name
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH.format(personal_code=personal_code),
                message="Missing required arguments"
            )

        try:
            updated_person = await update_person(personal_code, person_data_model)
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
                message = "Person with such params already exists"

            self.set_status(status_code)
            return self.write_error(
                status_code=status_code,
                path=self.PATH.format(personal_code=personal_code),
                message=message
            )
        
        if not updated_person:
            self.set_status(404)
            return self.write_error(
                status_code=404,
                path=self.PATH.format(personal_code=personal_code),
                message="No person found"
            )

        return self.write_response({
            "personal_code": updated_person['personal_code'],
            "first_name": updated_person['first_name'],
            "last_name": updated_person['last_name'],
            "created_at": self.extract_datetime(updated_person["created_at"]),
            "updated_at": self.extract_datetime(updated_person["updated_at"])
        })

    async def delete(self, personal_code: int):
        self.clear()

        if isinstance(personal_code, str) and personal_code.isnumeric():
            personal_code = int(personal_code)

        try:
            await delete_person(personal_code)
        except Exception as e:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH.format(personal_code=personal_code),
                message="Internal server error"
            )
