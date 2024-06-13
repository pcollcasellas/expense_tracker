from typing import Annotated

from pydantic import BaseModel, Field

from database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, Path
from models import Users
from sqlalchemy.orm import Session
from starlette import status
from .auth import get_current_user, bcrypt_context

router = APIRouter(prefix="/api/user", tags=["User"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    return db.query(Users).filter(Users.id == user.get("id")).first()


class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)


@router.put("/change_password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    user: user_dependency, db: db_dependency, user_verification: UserVerification
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_model = db.query(Users).filter(Users.id == user.get("id")).first()

    if not bcrypt_context.verify(
        user_verification.password, user_model.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Incorrect Password")

    user_model.hashed_password = bcrypt_context.hash(user_verification.new_password)

    db.add(user_model)
    db.commit()


class UserUpdateData(BaseModel):
    first_name: str
    last_name: str
    phone_number: str


@router.put("/update_user_data", status_code=status.HTTP_204_NO_CONTENT)
async def update_user_data(
    user: user_dependency, db: db_dependency, user_update_data: UserUpdateData
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_model = db.query(Users).filter(Users.id == user.get("id")).first()

    user_model.first_name = user_update_data.first_name
    user_model.last_name = user_update_data.last_name
    user_model.phone_number = user_update_data.phone_number

    db.add(user_model)
    db.commit()
