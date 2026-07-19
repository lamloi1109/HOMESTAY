"""Tính giá theo đêm: price_rules (range ngày + weekday mask, priority cao
thắng) → không khớp thì base_price của room_type. Giá chốt theo quote — giá
từng đêm được snapshot vào booking_nights lúc tạo booking, không tính lại.
"""

import uuid
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import PriceRule, RoomType


def _rule_matches(rule: PriceRule, night: date) -> bool:
    if rule.date_start is not None and night < rule.date_start:
        return False
    if rule.date_end is not None and night > rule.date_end:
        return False
    if rule.weekday_mask is not None and not (rule.weekday_mask >> night.weekday()) & 1:
        return False
    return True


async def quote_nights(
    session: AsyncSession,
    room_type_id: uuid.UUID,
    check_in: date,
    check_out: date,
) -> list[tuple[date, Decimal]]:
    """Trả về [(đêm, giá)] cho từng đêm trong [check_in, check_out)."""
    room_type = await session.get(RoomType, room_type_id)
    if room_type is None:
        raise ValueError("room_type not found")

    rules = (
        (
            await session.execute(
                select(PriceRule)
                .where(PriceRule.room_type_id == room_type_id)
                .order_by(PriceRule.priority.desc(), PriceRule.created_at.desc())
            )
        )
        .scalars()
        .all()
    )

    nights: list[tuple[date, Decimal]] = []
    night = check_in
    while night < check_out:
        price = room_type.base_price
        for rule in rules:  # rules đã sort priority desc — rule đầu tiên khớp thắng
            if _rule_matches(rule, night):
                price = rule.price
                break
        nights.append((night, Decimal(price)))
        night += timedelta(days=1)
    return nights
