from datetime import UTC, datetime, timedelta
from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.config import Settings
from app.database import get_db
from app.models import User

password_hash = PasswordHash.recommended()
bearer = HTTPBearer(auto_error=False)


def secret() -> str:
    value = Settings().jwt_secret
    if len(value) < 32:
        raise RuntimeError("JWT_SECRET debe tener al menos 32 caracteres")
    return value


def create_token(user_id: UUID) -> str:
    expiry = datetime.now(UTC) + timedelta(minutes=Settings().access_token_minutes)
    return jwt.encode({"sub": str(user_id), "exp": expiry}, secret(), algorithm="HS256")


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesión inválida", headers={"WWW-Authenticate": "Bearer"})
    if credentials is None:
        raise error
    try:
        payload = jwt.decode(credentials.credentials, secret(), algorithms=["HS256"], options={"require": ["sub", "exp"]})
        user_id = UUID(payload["sub"])
    except (InvalidTokenError, ValueError, TypeError, KeyError):
        raise error from None
    user = db.get(User, user_id)
    if user is None:
        raise error
    return user
