from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship, validates
from sqlalchemy.schema import CheckConstraint

# from server.enums import Roles
# from server.classes.dependency import D
# from server.datamodels.account import AccountDataModel
from . import AbstractBase


class Company(AbstractBase):
    __tablename__ = 'company'
    __table_args__ = (
        CheckConstraint('length(name) > 3',
                        name='name_min_length'),
        CheckConstraint('7 < length(registration_code) > 7',
                        name='registration_code_invalid'),
        CheckConstraint('length(total_capital) < 2500',
                        name='total_capital_amount_too_small'),
    )

    # area_settings = relationship('AreaSettings', cascade='all,delete')
    name = Column(String(100), unique=True, nullable=False)
    registration_code = Column(Integer, unique=True, nullable=False)
    total_capital = Column(Integer, nullable=False)

    @validates('name')
    def validate_name(self, key, name) -> str:
        if len(name) < 3:
            raise ValueError('name is too short')
        return name
    
    @validates('registration_code')
    def validate_registration_code(self, key, registration_code) -> int:
        if len(registration_code) < 3:
            raise ValueError('registration_code is invalid')
        return registration_code
    
    @validates('total_capital')
    def validate_total_capital(self, key, total_capital) -> int:
        if len(total_capital) <= 2500:
            raise ValueError('The amount of total_capital is too small')
        return total_capital
