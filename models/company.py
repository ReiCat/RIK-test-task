from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, BigInteger
from sqlalchemy.orm import relationship, validates
from sqlalchemy.schema import CheckConstraint

from classes.dependency import D
from datamodels.company_data_model import CompanyDataModel
from . import Base


class Company(Base):
    __tablename__ = 'companies'
    # __table_args__ = (
    #     CheckConstraint('length(company_name) > 3',
    #                     name='company_name_min_length'),
    #     CheckConstraint('7 < length(registration_code) > 7',
    #                     name='registration_code_invalid'),
    #     CheckConstraint('length(total_capital) < 2500',
    #                     name='total_capital_amount_too_small'),
    # )

    shareholder = relationship('Shareholder', cascade='all,delete')
    registration_code = Column(BigInteger, unique=True, primary_key=True)
    company_name = Column(String(100), unique=True, nullable=False)
    total_capital = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=True)
    updated_at = Column(DateTime)

    # @validates('company_name')
    # def validate_name(self, key, company_name) -> str:
    #     if len(company_name) < 3:
    #         raise ValueError('company_name is too short')
    #     return company_name
    
    # @validates('registration_code')
    # def validate_registration_code(self, key, registration_code) -> int:
    #     if len(registration_code) < 3:
    #         raise ValueError('registration_code is invalid')
    #     return registration_code
    
    # @validates('total_capital')
    # def validate_total_capital(self, key, total_capital) -> int:
    #     if len(total_capital) <= 2500:
    #         raise ValueError('The amount of total_capital is too small')
    #     return total_capital

async def get_companies_by_search_params(
    company_name: str = None,
    registration_code: int = 0,
    shareholder_name: str = None,
    shareholder_personal_code: int = 0
):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            companies = await connection.fetch(
                """
                    SELECT
                        registration_code, company_name
                    FROM 
                        companies
                    WHERE
                        COALESCE($1, '') <> '' AND $1 != '' AND LOWER(company_name) LIKE '%' || LOWER($1) || '%'
                    OR
                        registration_code = $2
                    OR 
                        registration_code = (
                            SELECT
                                company_registration_code
                            FROM
                                shareholders
                            WHERE
                                COALESCE($3, '') <> '' AND LOWER(first_name) LIKE '%' || LOWER($3) || '%'
                            OR
                                COALESCE($3, '') <> '' AND LOWER(last_name) LIKE '%' || LOWER($3) || '%'
                            OR
                                personal_code = $4
                        );
                """,
                company_name,
                int(registration_code),
                shareholder_name,
                int(shareholder_personal_code)
            )
    return companies


async def get_company_by_registration_code(
    registration_code: int = 0,
):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            company = await connection.fetchrow(
                """
                SELECT
                    registration_code, 
                    company_name, 
                    total_capital, 
                    created_at, 
                    updated_at 
                FROM 
                    companies
                WHERE
                    registration_code = $1;
                """,
                registration_code
            )
    return company


async def insert_company(
    company_data_model: CompanyDataModel
):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            inserted_company = await connection.fetchrow(
                """
                INSERT INTO
                    companies (
                        registration_code,
                        company_name,
                        total_capital,
                        created_at
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4
                    ) RETURNING
                        registration_code,
                        company_name,
                        total_capital,
                        created_at;
                """,
                company_data_model.registration_code,
                company_data_model.company_name,
                company_data_model.total_capital,
                datetime.now()
            )
    return inserted_company


async def delete_company(registration_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            await connection.exec(
                """
                DELETE FROM 
                    company 
                WHERE 
                    registration_code = $1;
                """,
                registration_code
            )
    return True


async def update_company(old_registration_code: int, company_data_model: CompanyDataModel):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            updated_company = await connection.fetchrow(
                """
                UPDATE
                        companies
                    SET
                        registration_code = $2,
                        company_name = $3,
                        created_at = $4,
                        updated_at = $5
                    WHERE
                        registration_code = $1
                    RETURNING
                        registration_code,
                        company_name,
                        total_capital,
                        created_at,
                        updated_at;
                """,
                old_registration_code,
                company_data_model.registration_code,
                company_data_model.company_name,
                company_data_model.created_at if company_data_model.created_at else None,
                datetime.now()
            )
    return updated_company
