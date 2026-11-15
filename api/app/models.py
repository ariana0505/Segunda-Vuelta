import enum
import uuid

from sqlalchemy import Boolean, Enum, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ListingMode(str, enum.Enum):
    donacion = "donacion"
    intercambio = "intercambio"


class ListingStatus(str, enum.Enum):
    disponible = "disponible"
    reservada = "reservada"
    cerrada = "cerrada"


class RequestStatus(str, enum.Enum):
    pendiente = "pendiente"
    aceptada = "aceptada"
    encuentro_acordado = "encuentro_acordado"
    rechazada = "rechazada"
    sin_acuerdo = "sin_acuerdo"


class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))


class Listing(Base):
    __tablename__ = "listings"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(60))
    category: Mapped[str] = mapped_column(String(50))
    size: Mapped[str] = mapped_column(String(15))
    condition: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(Text)
    zone: Mapped[str] = mapped_column(String(40))
    mode: Mapped[ListingMode] = mapped_column(Enum(ListingMode, name="listing_mode"))
    status: Mapped[ListingStatus] = mapped_column(Enum(ListingStatus, name="listing_status"), default=ListingStatus.disponible)


class ListingImage(Base):
    __tablename__ = "listing_images"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    listing_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("listings.id"), index=True)
    path: Mapped[str] = mapped_column(String(500))
    position: Mapped[int]
    __table_args__ = (UniqueConstraint("listing_id", "position"),)


class ClothingRequest(Base):
    __tablename__ = "requests"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    listing_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("listings.id"), index=True)
    requester_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    offered_listing_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("listings.id"))
    message: Mapped[str] = mapped_column(String(280))
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus, name="request_status"), default=RequestStatus.pendiente)
    requester_agreed: Mapped[bool] = mapped_column(Boolean, default=False)
    owner_agreed: Mapped[bool] = mapped_column(Boolean, default=False)


class Contact(Base):
    __tablename__ = "contacts"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    request_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("requests.id"), index=True)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    phone: Mapped[str] = mapped_column(String(30))
    __table_args__ = (UniqueConstraint("request_id", "user_id"),)
