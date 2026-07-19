import uuid

from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPKMixin


class User(UUIDPKMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False)
    # Nullable: hỗ trợ guest checkout (tạo user record không mật khẩu) ở Phase 4.
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    memberships: Mapped[list["UserOrgRole"]] = relationship(back_populates="user")


class Role(UUIDPKMixin, TimestampMixin, Base):
    """Permission-based, không hardcode if-else theo role name (KE_HOACH Phase 1).

    MVP seed 4 role (guest_member, staff, owner, admin) nhưng bảng hỗ trợ mở
    rộng lên 8 role Phase 7+ chỉ bằng cách thêm row + permission codes.
    """

    __tablename__ = "roles"

    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    permissions: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)


class UserOrgRole(UUIDPKMixin, TimestampMixin, Base):
    """RBAC theo org: 1 user có đúng 1 role trong 1 org (MVP)."""

    __tablename__ = "user_org_roles"
    __table_args__ = (UniqueConstraint("user_id", "org_id", name="uq_user_org"),)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False
    )

    user: Mapped[User] = relationship(back_populates="memberships")
    role: Mapped[Role] = relationship(lazy="joined")
