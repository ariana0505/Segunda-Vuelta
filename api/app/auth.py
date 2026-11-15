from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import create_token, get_current_user, password_hash

router = APIRouter()
DB = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
DUMMY_HASH = password_hash.hash("not-a-real-password")


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class Registration(Credentials):
    name: str = Field(min_length=1, max_length=100)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Escribe tu nombre")
        return value


class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        return Registration.clean_name(value)


class Profile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/auth/register", response_model=Profile, status_code=status.HTTP_201_CREATED)
def register(data: Registration, db: DB) -> User:
    user = User(name=data.name, email=data.email.lower(), password_hash=password_hash.hash(data.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="No se pudo registrar esta cuenta") from None
    db.refresh(user)
    return user


@router.post("/auth/login", response_model=Token)
def login(data: Credentials, db: DB) -> Token:
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    valid = password_hash.verify(data.password, user.password_hash if user else DUMMY_HASH)
    if not user or not valid:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos", headers={"WWW-Authenticate": "Bearer"})
    return Token(access_token=create_token(user.id))


@router.get("/me", response_model=Profile)
def read_profile(user: CurrentUser) -> User:
    return user


@router.patch("/me", response_model=Profile)
def update_profile(data: ProfileUpdate, user: CurrentUser, db: DB) -> User:
    user.name = data.name
    db.commit()
    db.refresh(user)
    return user
