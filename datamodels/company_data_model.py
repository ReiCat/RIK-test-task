from datetime import datetime
from pydantic import BaseModel


class CompanyDataModel(BaseModel):
    registration_code: int
    company_name: str
    created_at: datetime = None
    updated_at: datetime = None
