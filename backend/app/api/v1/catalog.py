import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import ensure_permission, get_current_user, get_db
from app.core.permissions import Perm
from app.models import (
    Amenity,
    Property,
    PropertyAmenity,
    Room,
    RoomType,
    User,
)
from app.models.property import PropertyStatus
from app.schemas.catalog import (
    AmenityOut,
    PropertyCreate,
    PropertyDetailOut,
    PropertyOut,
    RoomCreate,
    RoomOut,
    RoomTypeCreate,
    RoomTypeOut,
    SetAmenitiesRequest,
)

router = APIRouter(tags=["catalog"])


async def _get_property_or_404(db: AsyncSession, property_id: uuid.UUID) -> Property:
    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Property không tồn tại")
    return prop


@router.post(
    "/orgs/{org_id}/properties",
    response_model=PropertyOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_property(
    org_id: uuid.UUID,
    body: PropertyCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Property:
    await ensure_permission(db, user, org_id, Perm.PROPERTY_WRITE)
    prop = Property(org_id=org_id, status=PropertyStatus.active, **body.model_dump())
    db.add(prop)
    await db.commit()
    return prop


@router.get("/properties", response_model=list[PropertyOut])
async def list_properties(db: AsyncSession = Depends(get_db)) -> list[Property]:
    result = await db.execute(
        select(Property).where(Property.status == PropertyStatus.active).order_by(Property.created_at)
    )
    return list(result.scalars().all())


@router.get("/properties/{property_id}", response_model=PropertyDetailOut)
async def property_detail(property_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    prop = await db.scalar(
        select(Property)
        .where(Property.id == property_id)
        .options(
            selectinload(Property.room_types),
            selectinload(Property.amenities).selectinload(PropertyAmenity.amenity),
        )
    )
    if prop is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Property không tồn tại")
    return PropertyDetailOut(
        **PropertyOut.model_validate(prop).model_dump(),
        room_types=[RoomTypeOut.model_validate(rt) for rt in prop.room_types],
        amenities=[AmenityOut.model_validate(pa.amenity) for pa in prop.amenities],
    )


@router.post(
    "/properties/{property_id}/room-types",
    response_model=RoomTypeOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_room_type(
    property_id: uuid.UUID,
    body: RoomTypeCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RoomType:
    prop = await _get_property_or_404(db, property_id)
    await ensure_permission(db, user, prop.org_id, Perm.PROPERTY_WRITE)
    room_type = RoomType(property_id=property_id, **body.model_dump())
    db.add(room_type)
    await db.commit()
    return room_type


@router.post(
    "/room-types/{room_type_id}/rooms",
    response_model=RoomOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_room(
    room_type_id: uuid.UUID,
    body: RoomCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Room:
    room_type = await db.get(RoomType, room_type_id)
    if room_type is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Room type không tồn tại")
    prop = await _get_property_or_404(db, room_type.property_id)
    await ensure_permission(db, user, prop.org_id, Perm.PROPERTY_WRITE)
    room = Room(room_type_id=room_type_id, code=body.code)
    db.add(room)
    await db.commit()
    return room


@router.get("/amenities", response_model=list[AmenityOut])
async def list_amenities(db: AsyncSession = Depends(get_db)) -> list[Amenity]:
    result = await db.execute(select(Amenity).order_by(Amenity.group_name, Amenity.name))
    return list(result.scalars().all())


@router.put("/properties/{property_id}/amenities", response_model=list[AmenityOut])
async def set_property_amenities(
    property_id: uuid.UUID,
    body: SetAmenitiesRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[Amenity]:
    """Thay toàn bộ danh sách tiện ích của property (danh mục chuẩn hóa — PRD mục 7.3)."""
    prop = await _get_property_or_404(db, property_id)
    await ensure_permission(db, user, prop.org_id, Perm.PROPERTY_WRITE)

    amenities = (
        (await db.execute(select(Amenity).where(Amenity.code.in_(body.amenity_codes))))
        .scalars()
        .all()
    )
    found_codes = {a.code for a in amenities}
    missing = set(body.amenity_codes) - found_codes
    if missing:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"Tiện ích không có trong danh mục: {sorted(missing)}",
        )

    existing = (
        (await db.execute(select(PropertyAmenity).where(PropertyAmenity.property_id == property_id)))
        .scalars()
        .all()
    )
    for pa in existing:
        await db.delete(pa)
    for amenity in amenities:
        db.add(PropertyAmenity(property_id=property_id, amenity_id=amenity.id))
    await db.commit()
    return list(amenities)
