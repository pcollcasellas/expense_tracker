from typing import Annotated

from pydantic import BaseModel, Field

from database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, Path
from models import Transactions
from sqlalchemy.orm import Session
from starlette import status
from .auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/transactions", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None or user.get("user_role") != "admin":
        raise HTTPException(status_code=401, detail="Authentication Failed")

    return db.query(Transactions).all()


@router.delete("/expense/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    user: user_dependency, db: db_dependency, expense_id: int = Path(..., gt=0)
):
    if user is None or user.get("user_role") != "admin":
        raise HTTPException(status_code=401, detail="Authentication Failed")

    expense_model = db.query(Transactions).filter(Transactions.id == expense_id).first()
    if expense_model is None:
        raise HTTPException(status_code=404, detail="Expense not found.")

    db.query(Transactions).filter(Transactions.id == expense_id).delete()

    db.commit()
