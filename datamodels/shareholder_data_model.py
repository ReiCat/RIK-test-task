from datetime import datetime
from pydantic import BaseModel


class ShareholderDataModel(BaseModel):
    id: int = None
    company_registration_code: int
    shareholder_personal_code: int
    capital: int
    founder: bool
    created_at: datetime = None
    updated_at: datetime = None