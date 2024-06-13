import datetime
from enum import Enum
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status

from database import SessionLocal
from models import Transactions

from .auth import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class TransactionType(str, Enum):
    income = "income"
    expense = "expense"


class TransactionRequest(BaseModel):
    title: str = Field(min_length=3, max_length=30)
    description: str = Field(min_length=3, max_length=100)
    transaction_type: TransactionType
    amount: int
    date: datetime.date


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    return db.query(Transactions).filter(Transactions.user_id == user.get("id")).all()


@router.get("/{transaction_id}", status_code=status.HTTP_200_OK)
async def read_transaction(
    user: user_dependency, db: db_dependency, transaction_id: int = Path(..., gt=0)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    transaction_model = (
        db.query(Transactions)
        .filter(Transactions.id == transaction_id)
        .filter(Transactions.user_id == user.get("id"))
        .first()
    )
    if transaction_model is not None:
        return transaction_model
    raise HTTPException(status_code=404, detail="Transaction not found.")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_transaction(
    user: user_dependency, db: db_dependency, transaction_request: TransactionRequest
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    transaction_model = Transactions(
        **transaction_request.model_dump(), user_id=user.get("id")
    )

    db.add(transaction_model)
    db.commit()
    db.refresh(transaction_model)

    return transaction_model


@router.put("/{transaction_id}", status_code=status.HTTP_200_OK)
async def update_transaction(
    user: user_dependency,
    db: db_dependency,
    transaction_request: TransactionRequest,
    transaction_id: int = Path(..., gt=0),
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    transaction_model = (
        db.query(Transactions)
        .filter(Transactions.id == transaction_id)
        .filter(Transactions.user_id == user.get("id"))
        .first()
    )
    if transaction_model is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    transaction_model.title = transaction_request.title
    transaction_model.description = transaction_request.description
    transaction_model.transaction_type = transaction_request.transaction_type
    transaction_model.amount = transaction_request.amount
    transaction_model.date = transaction_request.date

    db.add(transaction_model)
    db.commit()
    db.refresh(transaction_model)

    return transaction_model


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    user: user_dependency, db: db_dependency, transaction_id: int = Path(..., gt=0)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    transaction_model = (
        db.query(Transactions)
        .filter(
            Transactions.id == transaction_id, Transactions.user_id == user.get("id")
        )
        .first()
    )
    if transaction_model is None:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    db.query(Transactions).filter(Transactions.id == transaction_id).filter(
        Transactions.user_id == user.get("id")
    ).delete()

    db.commit()
