from datetime import datetime
from pydantic import BaseModel
from enums import SHAREHOLDER_TYPES


class ShareholderDataModel(BaseModel):
    id: int = None
    company_registration_code: int
    shareholder_code: int
    shareholder_type: SHAREHOLDER_TYPES
    capital: int
    founder: bool
    created_at: datetime = None
    updated_at: datetime = None