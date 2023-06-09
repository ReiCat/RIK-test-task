from datetime import datetime
from pydantic import BaseModel


class CompanyDataModel(BaseModel):
    registration_code: int
    company_name: str
    total_capital: int = None
    created_at: datetime = None
    updated_at: datetime = None
