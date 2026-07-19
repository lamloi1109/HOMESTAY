import enum
import uuid
from decimal import Decimal

from sqlalchemy import CheckConstraint, Enum, ForeignKey, Index, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPKMixin


class PaymentProvider(str, enum.Enum):
    vnpay = "vnpay"
    momo = "momo"
    manual = "manual"  # lễ tân thu tiền mặt / chuyển khoản tay


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    success = "success"
    failed = "failed"
    refunded = "refunded"


class Payment(UUIDPKMixin, TimestampMixin, Base):
    """1-1 với booking (KE_HOACH Phase 1). IPN là nguồn sự thật duy nhất để
    confirm booking (Phase 3); `idempotency_key` unique chặn IPN gọi 2 lần
    ghi ledger đôi.
    """

    __tablename__ = "payments"

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="RESTRICT"),
        unique=True,
        nullable=False,
    )
    provider: Mapped[PaymentProvider] = mapped_column(
        Enum(PaymentProvider, name="payment_provider"), nullable=False
    )
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        default=PaymentStatus.pending,
        nullable=False,
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 0), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="VND", nullable=False)
    provider_txn_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    idempotency_key: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    raw_ipn: Mapped[dict | None] = mapped_column(JSONB, nullable=True)


class LedgerEntry(UUIDPKMixin, TimestampMixin, Base):
    """Sổ cái kép — thiết kế từ Phase 1, ghi thật từ Phase 3 (KE_HOACH).

    Mỗi giao dịch = 1 `txn_group_id` với >= 2 entry, tổng debit = tổng credit
    trong group (invariant enforce ở service layer Phase 3 + đối soát).
    APPEND-ONLY: không UPDATE/DELETE — sai thì ghi entry đảo.
    """

    __tablename__ = "ledger_entries"
    __table_args__ = (
        CheckConstraint("debit >= 0 AND credit >= 0", name="ck_ledger_non_negative"),
        CheckConstraint(
            "(debit = 0) <> (credit = 0)", name="ck_ledger_debit_xor_credit"
        ),
        Index("ix_ledger_txn_group", "txn_group_id"),
        Index("ix_ledger_org", "org_id"),
    )

    txn_group_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="RESTRICT"), nullable=False
    )
    # Chart of accounts dạng code text — mở rộng không cần migration
    # (vd: cash, gateway_receivable, room_revenue, refund_payable).
    account: Mapped[str] = mapped_column(String(64), nullable=False)
    booking_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("bookings.id", ondelete="RESTRICT"), nullable=True
    )
    payment_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("payments.id", ondelete="RESTRICT"), nullable=True
    )
    debit: Mapped[Decimal] = mapped_column(Numeric(12, 0), default=0, nullable=False)
    credit: Mapped[Decimal] = mapped_column(Numeric(12, 0), default=0, nullable=False)
    memo: Mapped[str | None] = mapped_column(String(500), nullable=True)
