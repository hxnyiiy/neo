import uuid
from sqlalchemy import Column, String, INT
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String(36), primary_key=True, default=str(uuid.uuid4()))
    nickname = Column(String(120), unique=Falsenullable=False)
    email = Column(String(120), unique=True, nullable=False)
    phone = Column(String(120), unique=True, nullable=False)
    description = Column(String(120), nullable=True)