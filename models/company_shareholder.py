from datetime import datetime

from sqlalchemy import Column, Integer, BigInteger, ForeignKey, Boolean, UniqueConstraint

from classes.dependency import D
from datamodels.company_shareholder_data_model import CompanyShareholderDataModel
from . import AbstractBase

class CompanyShareholder(AbstractBase):
    __tablename__ = 'companies_shareholders'
    __table_args__ = (
        UniqueConstraint(
            'company_registration_code', 
            'shareholder_personal_code'
        ),
    )

    company_registration_code = Column(BigInteger, ForeignKey('companies.registration_code'), nullable=False)
    shareholder_personal_code = Column(BigInteger, ForeignKey('shareholders.personal_code'), nullable=False)
    capital = Column(Integer, nullable=False)
    founder = Column(Boolean, default=False)


async def get_company_shareholders_by_company_registration_code(company_registration_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholder_list = await connection.fetch(
                """
                SELECT
                    id, 
                    company_registration_code, 
                    shareholder_personal_code, 
                    capital, 
                    founder, 
                    sh.first_name,
                    sh.last_name
                FROM 
                    companies_shareholders cs
                LEFT JOIN
                    shareholders sh ON sh.personal_code = cs.shareholder_personal_code 
                WHERE 
                    company_registration_code = $1;
                """,
                company_registration_code
            )
    return shareholder_list


async def get_shareholder_companies_by_shareholder_personal_code(shareholder_personal_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholder_list = await connection.fetch(
                """
                SELECT
                    id, 
                    company_registration_code, 
                    shareholder_personal_code, 
                    capital, 
                    founder, 
                    c.company_name
                FROM 
                    companies_shareholders cs
                LEFT JOIN
                    companies c ON c.registration_code = cs.company_registration_code 
                WHERE 
                    shareholder_personal_code = $1;
                """,
                shareholder_personal_code
            )
    return shareholder_list


async def insert_company_shareholder(company_shareholder_data_model: CompanyShareholderDataModel):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            inserted_company = await connection.fetchrow(
                """
                INSERT INTO
                    companies_shareholders (
                        company_registration_code,
                        shareholder_personal_code,
                        capital,
                        founder,
                        created_at
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    ) RETURNING
                        company_registration_code,
                        shareholder_personal_code,
                        capital,
                        founder,
                        created_at;
                """,
                company_shareholder_data_model.company_registration_code,
                company_shareholder_data_model.shareholder_personal_code,
                company_shareholder_data_model.capital,
                company_shareholder_data_model.founder,
                datetime.now()
            )
    return inserted_company