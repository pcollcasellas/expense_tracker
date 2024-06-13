import enum

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.sql import func

from database import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)
    phone_number = Column(String)


class TransactionType(enum.Enum):
    income = "income"
    expense = "expense"


class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Numeric(10, 2), default=0)
    date = Column(Date, default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
