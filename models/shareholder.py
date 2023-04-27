from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, BigInteger, ForeignKey, Boolean
from sqlalchemy.orm import relationship, validates
from sqlalchemy.schema import CheckConstraint

from classes.dependency import D
# from datamodels.company_data_model import CompanyDataModel
from . import Base


class Shareholder(Base):
    __tablename__ = 'shareholders'

    # TODO: check if company already has a founder

    company_registration_code = Column(BigInteger, ForeignKey('companies.registration_code'), nullable=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    personal_code = Column(BigInteger, unique=True, primary_key=True)
    founder = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime)


async def get_shareholder_list_by_company_registration_code(company_registration_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholder_list = await connection.fetch(
                'SELECT * FROM shareholders WHERE company_registration_code = $1;',
                company_registration_code
            )
    return shareholder_list


async def get_shareholder_by_personal_code(personal_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholder_list = await connection.fetch(
                'SELECT * FROM shareholders WHERE personal_code = $1;',
                personal_code
            )
    return shareholder_list