from datetime import datetime
from sqlalchemy import Column, Integer, BigInteger, ForeignKey, Boolean, UniqueConstraint

from classes.dependency import D
from datamodels.shareholder_data_model import ShareholderDataModel
from . import AbstractBase
from enums import SHAREHOLDER_TYPES


class Shareholder(AbstractBase):
    __tablename__ = 'shareholders'
    __table_args__ = (
        UniqueConstraint(
            'company_registration_code', 
            'shareholder_code'
        ),
    )

    company_registration_code = Column(
        BigInteger, 
        ForeignKey('companies.registration_code', ondelete='CASCADE'), 
        nullable=True
    )

    shareholder_code = Column(BigInteger, nullable=True)
    shareholder_type = Column(Integer, nullable=False, default=SHAREHOLDER_TYPES.INDIVIDUAL)
    capital = Column(Integer, nullable=False)
    founder = Column(Boolean, default=False)


async def get_shareholders_by_company_registration_code(
    company_registration_code: int
):
    if not isinstance(company_registration_code, int):
        company_registration_code = 0

    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholders = await connection.fetch(
                """
                SELECT 
                    c.registration_code, 
                    c.company_name, 
                    p.first_name, 
                    p.last_name, 
                    sh.shareholder_type, 
                    sh.shareholder_code, 
                    sh.capital as shareholder_capital, 
                    sh.founder, 
                    c2.company_name as shareholder_company_name,
                    sh.created_at,
                    sh.updated_at 
                FROM 
                    companies c
                JOIN 
                    shareholders sh 
                ON 
                    c.registration_code = sh.company_registration_code
                LEFT JOIN 
                    persons p 
                ON 
                    sh.shareholder_code = p.personal_code
                LEFT JOIN 
                    companies c2 
                ON 
                    sh.shareholder_code = c2.registration_code
                WHERE 
                    c.registration_code = $1;
                """,
                company_registration_code
            )
    return shareholders


async def get_companies_by_shareholder_code_and_type(
        shareholder_code: int, 
        shareholder_type: int
):
    if not isinstance(shareholder_code, int):
        shareholder_code = 0

    if not isinstance(shareholder_type, int):
        shareholder_type = 0

    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            shareholders = await connection.fetch(
                """
                SELECT
                    id,
                    company_registration_code, 
                    shareholder_code, 
                    shareholder_type,
                    capital,
                    founder,
                    c.company_name,
                    sh.created_at,
                    sh.updated_at
                FROM 
                    shareholders sh
                LEFT JOIN
                    companies c 
                ON 
                    c.registration_code = sh.company_registration_code 
                WHERE 
                    shareholder_code = $1
                AND
                    shareholder_type = $2;
                """,
                shareholder_code,
                shareholder_type
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
                        shareholder_code,
                        shareholder_type,
                        capital,
                        founder,
                        created_at
                    ) 
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING
                    company_registration_code,
                    shareholder_code,
                    shareholder_type,
                    capital,
                    founder,
                    created_at,
                    updated_at;
                """,
                shareholder_data_model.company_registration_code,
                shareholder_data_model.shareholder_code,
                shareholder_data_model.shareholder_type,
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
                    ),
                    updated_at = $2
                WHERE 
                    companies.registration_code = $1;
                """,
                shareholder_data_model.company_registration_code,
                datetime.now()
            )
    return inserted_shareholder


async def delete_shareholder(
        company_registration_code: int, 
        shareholder_code: int
):
    if not isinstance(company_registration_code, int):
        company_registration_code = 0

    if not isinstance(shareholder_code, int):
        shareholder_code = 0

    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """
                WITH updated as (
                    UPDATE
                        companies
                    SET
                        total_capital = total_capital - subquery.capital,
                        updated_at = $3
                    FROM
                    (
                        SELECT
                            company_registration_code, 
                            shareholder_code,
                            shareholder_type,
                            capital
                        FROM
                            shareholders
                        WHERE
                            company_registration_code = $1
                        AND
                            shareholder_code = $2
                    ) AS subquery
                    WHERE
                        companies.registration_code = subquery.company_registration_code
                    RETURNING
                        subquery.company_registration_code,
                        subquery.shareholder_code
                )
                DELETE FROM 
                    shareholders AS sh
                USING 
                    updated AS u
                WHERE 
                    u.company_registration_code = sh.company_registration_code
                AND
                    u.shareholder_code = sh.shareholder_code;
                """,
                company_registration_code,
                shareholder_code,
                datetime.now()
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
                    capital = $4,
                    founder = $5,
                    updated_at = $6
                WHERE
                    company_registration_code = $1
                AND
                    shareholder_code = $2
                AND
                    shareholder_type = $3
                RETURNING
                    company_registration_code,
                    shareholder_code,
                    shareholder_type,
                    capital,
                    founder,
                    created_at,
                    updated_at;
                """,
                shareholder_data_model.company_registration_code,
                shareholder_data_model.shareholder_code,
                shareholder_data_model.shareholder_type,
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
