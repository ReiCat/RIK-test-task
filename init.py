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

    D.get('loop').run_until_complete(
        init_async_cursor(
            db_host,
            db_name,
            db_user,
            db_password
        )
    )
    D.set('session', lambda: Session(engine))
