from datetime import datetime
from pydantic import BaseModel


class PersonDataModel(BaseModel):
    first_name: str
    last_name: str
    personal_code: int
    created_at: datetime = None
    updated_at: datetime = None