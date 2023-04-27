from datetime import datetime
from pydantic import BaseModel


class CompanyDataModel(BaseModel):
    company_registration_code: str
    first_name: str
    last_name: str
    personal_code: int
    founder: bool
    created_at: datetime = None
    updated_at: datetime = None
    id: int