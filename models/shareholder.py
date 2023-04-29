from datetime import datetime
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, Boolean, UniqueConstraint

from classes.dependency import D
from datamodels.shareholder_data_model import ShareholderDataModel
from . import AbstractBase

class Shareholder(AbstractBase):
    __tablename__ = 'shareholders'
    __table_args__ = (
        UniqueConstraint(
            'company_registration_code', 
            'shareholder_personal_code'
        ),
    )

    company_registration_code = Column(
        BigInteger, 
        ForeignKey('companies.registration_code'), 
        nullable=True
    )
    shareholder_personal_code = Column(
        BigInteger, 
        ForeignKey('persons.personal_code'), 
        # ondelete='CASCADE',
        nullable=True
    )
    capital = Column(Integer, nullable=False)
    founder = Column(Boolean, default=False)


async def get_shareholders_by_company_registration_code(company_registration_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholders = await connection.fetch(
                """
                SELECT
                    id, 
                    company_registration_code, 
                    shareholder_personal_code, 
                    capital, 
                    founder,
                    sh.created_at,
                    sh.updated_at,
                    p.first_name,
                    p.last_name
                FROM 
                    shareholders sh
                LEFT JOIN
                    persons p ON p.personal_code = sh.shareholder_personal_code 
                WHERE 
                    company_registration_code = $1;
                """,
                company_registration_code
            )
    return shareholders


async def get_companies_by_shareholder_personal_code(shareholder_personal_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholders = await connection.fetch(
                """
                SELECT
                    id, 
                    company_registration_code, 
                    shareholder_personal_code, 
                    capital, 
                    founder, 
                    c.company_name
                FROM 
                    shareholders sh
                LEFT JOIN
                    companies c ON c.registration_code = sh.company_registration_code 
                WHERE 
                    shareholder_personal_code = $1;
                """,
                shareholder_personal_code
            )
    return shareholders


async def insert_shareholder(shareholder_data_model: ShareholderDataModel):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            inserted_shareholder = await connection.fetchrow(
                """
                INSERT INTO
                    shareholders (
                        company_registration_code,
                        shareholder_personal_code,
                        capital,
                        founder,
                        created_at
                    ) 
                VALUES (
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
                shareholder_data_model.company_registration_code,
                shareholder_data_model.shareholder_personal_code,
                shareholder_data_model.capital,
                shareholder_data_model.founder,
                datetime.now()
            )

            await connection.execute(
                """
                UPDATE 
                    companies
                SET 
                    total_capital = (
                        SELECT 
                            SUM(capital) 
                        FROM 
                            shareholders 
                        WHERE 
                            company_registration_code = $1
                    )
                WHERE 
                    companies.registration_code = $1;
                """,
                shareholder_data_model.company_registration_code
            )
    return inserted_shareholder


async def delete_shareholder(company_registration_code: int, shareholder_personal_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """
                WITH updated as (
                    UPDATE
                        companies
                    SET
                        total_capital = total_capital - subquery.capital
                    FROM
                    (
                        SELECT
                            capital, 
                            company_registration_code, 
                            shareholder_personal_code
                        FROM
                            shareholders
                        WHERE
                            company_registration_code = $1
                        AND
                            shareholder_personal_code = $2
                            
                    ) AS subquery
                    WHERE
                        companies.registration_code = subquery.company_registration_code
                    RETURNING
                        subquery.shareholder_personal_code,
                        subquery.company_registration_code
                )
                DELETE FROM 
                    shareholders AS sh
                USING 
                    updated AS u
                WHERE 
                    u.shareholder_personal_code = sh.shareholder_personal_code
                and
                    u.company_registration_code = sh.company_registration_code;
                """,
                company_registration_code,
                shareholder_personal_code
            )
    return True


async def update_shareholder(shareholder_data_model: ShareholderDataModel):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            updated_shareholder = await connection.fetchrow(
                """
                UPDATE
                    shareholders
                SET
                    capital = $3,
                    founder = $4,
                    updated_at = $5
                WHERE
                    company_registration_code = $1
                AND
                    shareholder_personal_code = $2
                RETURNING
                    shareholder_personal_code,
                    company_registration_code,
                    capital,
                    founder,
                    created_at
                    updated_at;
                """,
                shareholder_data_model.company_registration_code,
                shareholder_data_model.shareholder_personal_code,
                shareholder_data_model.capital,
                shareholder_data_model.founder,
                datetime.now()
            )

    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """
                UPDATE 
                    companies
                SET 
                    total_capital = (
                        SELECT 
                            SUM(capital) 
                        FROM 
                            shareholders 
                        WHERE 
                            company_registration_code = $1
                    ),
                    updated_at = $2
                WHERE 
                    registration_code = $1
                """,
                shareholder_data_model.company_registration_code,
                datetime.now()
            )
    return updated_shareholder