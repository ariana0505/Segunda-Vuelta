from functools import lru_cache
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import Settings


class Base(DeclarativeBase):
    pass


@lru_cache
def session_factory() -> sessionmaker[Session]:
    url = Settings().database_url
    if not url:
        raise RuntimeError("DATABASE_URL no está configurada")
    return sessionmaker(bind=create_engine(url, pool_pre_ping=True), expire_on_commit=False)


def get_db() -> Iterator[Session]:
    with session_factory()() as session:
        yield session
