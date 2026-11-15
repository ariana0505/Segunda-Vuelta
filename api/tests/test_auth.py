from datetime import UTC, datetime, timedelta

import jwt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import User


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret-with-at-least-32-characters")
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)

    def db_override():
        with Session(engine, expire_on_commit=False) as db:
            yield db

    app.dependency_overrides[get_db] = db_override
    with TestClient(app) as test_client:
        yield test_client, engine
    app.dependency_overrides.clear()
    engine.dispose()


def test_register_login_and_profile(client):
    http, engine = client
    data = {"name": "Ariana", "email": "ariana@example.com", "password": "clave-segura"}
    response = http.post("/auth/register", json=data)
    assert response.status_code == 201
    assert "password_hash" not in response.json()
    with Session(engine) as db:
        assert db.scalar(select(User)).password_hash != data["password"]
    assert http.post("/auth/register", json=data).status_code == 409
    assert http.post("/auth/login", json={"email": data["email"], "password": "incorrecta"}).status_code == 401
    token = http.post("/auth/login", json=data).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    assert http.get("/me", headers=headers).json()["name"] == "Ariana"
    assert http.patch("/me", headers=headers, json={"name": "Ana"}).json()["name"] == "Ana"
    assert http.patch("/me", headers=headers, json={"name": "   "}).status_code == 422


def test_protected_profile_rejects_missing_and_expired_tokens(client):
    http, _ = client
    assert http.get("/me").status_code == 401
    token = jwt.encode({"sub": "123", "exp": datetime.now(UTC) - timedelta(seconds=1)}, "test-secret-with-at-least-32-characters", algorithm="HS256")
    assert http.get("/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401
