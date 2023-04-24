import asyncpg

from sqlalchemy import create_engine, Index
from sqlalchemy.orm import Session
from sqlalchemy.exc import ProgrammingError
from sqlalchemy_utils import create_database, database_exists

from classes.dependency import D
from models import Base
from settings import DB_NAME, DB_ECHO_REQUESTS

# Models need to be imported for Base to create empty tables in database


def create_index(index, engine):
    try:
        index.create(bind=engine)
    except ProgrammingError as _:
        pass


def initialize():
    url = f'sqlite:///{DB_NAME}'
    engine = create_engine(url, echo=DB_ECHO_REQUESTS)
    if not database_exists(engine.url):
        create_database(url)
    Base.metadata.create_all(engine)

    D.set('session', lambda: Session(engine))
