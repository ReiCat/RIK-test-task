import tornado

from handlers import RequestHandler
from datamodels.person_data_model import PersonDataModel
from models.person import get_persons, insert_person

class PersonsHandler(RequestHandler):
    PATH = "/api/persons"

    async def get(self):
        self.clear()

        try:
            raw_persons = await get_persons()
        except Exception as _:
            self.set_status(500)
            return self.write_error(
                status_code=500,
                path=self.PATH,
                message="Internal server error"
            )
        
        persons = []
        for raw_person in raw_persons:
            persons.append({
                "personal_code": raw_person["personal_code"],
                "first_name": raw_person["first_name"],
                "last_name": raw_person["last_name"],
                "created_at": self.extract_datetime(raw_person.get("created_at")),
                "updated_at": self.extract_datetime(raw_person.get("updated_at"))
            })

        return self.write_response(persons)

    async def post(self):
        body_data = self.request.body
        if not body_data:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH,
                message="Missing required arguments"
            )
        
        request_payload = tornado.escape.json_decode(body_data)
        personal_code = request_payload.get('personal_code')
        first_name = request_payload.get('first_name')
        last_name = request_payload.get('last_name')

        try:
            person_data_model = PersonDataModel(
                personal_code=personal_code,
                first_name=first_name,
                last_name=last_name
            )
        except Exception as _:
            self.set_status(400)
            return self.write_error(
                status_code=400,
                path=self.PATH,
                message="Missing required arguments"
            )

        try:
            inserted_person = await insert_person(person_data_model)
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
                path=self.PATH,
                message=message
            )

        self.set_status(201)
        return self.write_response({
            "personal_code": inserted_person['personal_code'],
            "first_name": inserted_person['first_name'],
            "last_name": inserted_person['last_name'],
            "created_at": self.extract_datetime(inserted_person.get("created_at")),
            "updated_at": self.extract_datetime(inserted_person.get("updated_at"))
        })