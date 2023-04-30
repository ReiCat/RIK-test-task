import asyncpg

from sqlalchemy import create_engine, Index
from sqlalchemy.orm import Session
from sqlalchemy.exc import ProgrammingError
from sqlalchemy_utils import create_database, database_exists

from classes.dependency import D
from models import Base
import settings

# Models need to be imported for Base to create empty tables in database
from models.company import Company
from models.person import Person
from models.shareholder import Shareholder

async def init_async_cursor(db_host, db_name, db_user, db_password):
    pool = await asyncpg.create_pool(host=db_host,
                                     database=db_name,
                                     user=db_user,
                                     password=db_password)
    D.set('pool', lambda: pool)


def create_index(index, engine):
    try:
        index.create(bind=engine)
    except ProgrammingError as _:
        pass


def initialize():
    db_host = settings.DB_HOST
    db_name = settings.DB_NAME
    db_user = settings.DB_USER
    db_password = settings.DB_PASSWORD

    url = f'postgresql+psycopg2://{db_user}:{db_password}@{db_host}/{db_name}'
    engine = create_engine(url, echo=settings.DB_ECHO_REQUESTS)
    if not database_exists(engine.url):
        create_database(url)
    Base.metadata.create_all(engine)

    companies_registration_code_idx = Index('companies_registration_code_idx', Company.registration_code)
    companies_company_name_idx = Index('companies_company_name_idx', Company.company_name)
    persons_first_name_idx = Index('persons_first_name_idx', Person.first_name)
    persons_last_name_idx = Index('persons_last_name_idx', Person.last_name)
    company_registration_code_idx = Index('company_registration_code_idx', Shareholder.company_registration_code)
    shareholder_code_idx = Index('shareholder_code_idx', Shareholder.shareholder_code)
    shareholder_type_idx = Index('shareholder_type_idx', Shareholder.shareholder_type)

    create_index(companies_registration_code_idx, engine)
    create_index(companies_company_name_idx, engine)

    create_index(persons_first_name_idx, engine)
    create_index(persons_last_name_idx, engine)

    create_index(company_registration_code_idx, engine)
    create_index(shareholder_code_idx, engine)
    create_index(shareholder_type_idx, engine)

    D.get('loop').run_until_complete(
        init_async_cursor(
            db_host,
            db_name,
            db_user,
            db_password
        )
    )
    D.set('session', lambda: Session(engine))
