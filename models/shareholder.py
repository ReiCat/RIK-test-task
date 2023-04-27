from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, BigInteger, ForeignKey, Boolean
from sqlalchemy.orm import relationship, validates
from sqlalchemy.schema import CheckConstraint

from classes.dependency import D
# from datamodels.company_data_model import CompanyDataModel
from . import AbstractBase


class Shareholder(AbstractBase):
    __tablename__ = 'shareholder'

    # TODO: check if company already has a founder

    company_registration_code = Column(String(7), ForeignKey('company.registration_code'), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    personal_code = Column(BigInteger, unique=True, nullable=False)
    founder = Column(Boolean, default=False)


async def get_shareholder_list_by_company_registration_code(company_registration_code: str):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholder_list = await connection.fetch(
                'SELECT * FROM shareholder WHERE company_registration_code = $1;',
                company_registration_code
            )
    return shareholder_list