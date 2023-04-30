from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import Column, Integer, DateTime

Base = declarative_base()


class AbstractBase(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime)
