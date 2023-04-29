from datetime import datetime
from sqlalchemy import Column, String, DateTime, BigInteger
from sqlalchemy.orm import relationship

from classes.dependency import D
from datamodels.person_data_model import PersonDataModel
from . import Base


class Person(Base):
    __tablename__ = 'persons'

    # TODO: check if company already has a founder

    shareholder = relationship('Shareholder', cascade='all,delete')
    personal_code = Column(BigInteger, unique=True, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime)


async def insert_person(person_data_model: PersonDataModel):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            inserted_person = await connection.fetchrow(
                """
                INSERT INTO
                    persons (
                        first_name,
                        last_name,
                        personal_code,
                        created_at
                    ) VALUES (
                        $1,
                        $2,
                        $3,
                        $4
                    ) RETURNING
                        first_name,
                        last_name,
                        personal_code,
                        created_at,
                        updated_at;
                """,
                person_data_model.first_name,
                person_data_model.last_name,
                person_data_model.personal_code,
                datetime.now()
            )
    return inserted_person


async def get_person_by_personal_code(personal_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            person = await connection.fetchrow(
                """
                SELECT 
                    first_name,
                    last_name,
                    personal_code,
                    created_at,
                    updated_at
                FROM 
                    persons 
                WHERE 
                    personal_code = $1;
                """,
                personal_code
            )
    return person


async def get_persons():
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            persons = await connection.fetch(
                """
                SELECT 
                    first_name,
                    last_name,
                    personal_code,
                    created_at,
                    updated_at
                FROM 
                    persons 
                WHERE 
                    personal_code = $1;
                """
            )
    return persons


async def delete_person(personal_code: int):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            await connection.exec(
                """
                DELETE FROM 
                    persons 
                WHERE 
                    personal_code = $1;
                """,
                personal_code
            )
    return True


async def update_person(old_personal_code: int, person_data_model: PersonDataModel):
    async with D.get('pool').acquire() as connection:
        async with connection.transaction():
            updated_person = await connection.fetchrow(
                """
                UPDATE
                    persons
                SET
                    first_name = $2,
                    last_name = $3,
                    personal_code = $4,
                    updated_at = $5
                WHERE
                    personal_code = $1
                RETURNING
                    personal_code,
                    first_name,
                    last_name,
                    created_at
                    updated_at;
                """,
                old_personal_code,
                person_data_model.first_name,
                person_data_model.last_name,
                person_data_model.personal_code,
                datetime.now()
            )
    return updated_person