import uuid
from datetime import date

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import ensure_permission, get_current_user, get_db
from app.core.permissions import Perm
from app.models import (
    Amenity,
    Property,
    PropertyAmenity,
    PropertyImage,
    Room,
    RoomType,
    User,
)
from app.services.storage import (
    MAX_IMAGE_BYTES,
    InvalidImageError,
    detect_image_ext,
    get_storage,
)
from app.models.property import PropertyStatus
from app.schemas.catalog import (
    AmenityOut,
    PropertyCreate,
    PropertyDetailOut,
    PropertyImageOut,
    PropertyListItemOut,
    PropertyOut,
    RoomCreate,
    RoomOut,
    RoomTypeCreate,
    RoomTypeDetailOut,
    RoomTypeOut,
    SetAmenitiesRequest,
)
from app.services.booking import get_available_rooms

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


@router.get("/properties", response_model=list[PropertyListItemOut])
async def list_properties(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Property)
        .where(Property.status == PropertyStatus.active)
        .options(selectinload(Property.images))
        .order_by(Property.created_at)
    )
    storage = get_storage()
    return [
        PropertyListItemOut(
            **PropertyOut.model_validate(p).model_dump(),
            cover_image=storage.public_url(p.images[0].stored_name) if p.images else None,
        )
        for p in result.scalars().all()
    ]


@router.get("/properties/{property_id}", response_model=PropertyDetailOut)
async def property_detail(property_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    prop = await db.scalar(
        select(Property)
        .where(Property.id == property_id)
        .options(
            selectinload(Property.room_types).selectinload(RoomType.rooms),
            selectinload(Property.amenities).selectinload(PropertyAmenity.amenity),
            selectinload(Property.images),
        )
    )
    if prop is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Property không tồn tại")
    storage = get_storage()
    return PropertyDetailOut(
        **PropertyOut.model_validate(prop).model_dump(),
        room_types=[RoomTypeDetailOut.model_validate(rt) for rt in prop.room_types],
        amenities=[AmenityOut.model_validate(pa.amenity) for pa in prop.amenities],
        images=[
            PropertyImageOut(
                id=img.id,
                url=storage.public_url(img.stored_name),
                alt=img.alt,
                sort_order=img.sort_order,
            )
            for img in prop.images
        ],
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


@router.get("/room-types/{room_type_id}/available-rooms", response_model=list[RoomOut])
async def available_rooms(
    room_type_id: uuid.UUID,
    check_in: date,
    check_out: date,
    db: AsyncSession = Depends(get_db),
):
    """Phòng còn trống trọn khoảng ngày — UI dùng để chọn phòng trước khi đặt."""
    room_type = await db.get(RoomType, room_type_id)
    if room_type is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Room type không tồn tại")
    return await get_available_rooms(db, room_type_id, check_in, check_out)


@router.post(
    "/properties/{property_id}/images",
    response_model=PropertyImageOut,
    status_code=status.HTTP_201_CREATED,
)
async def upload_property_image(
    property_id: uuid.UUID,
    file: UploadFile = File(...),
    alt: str | None = Form(default=None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PropertyImageOut:
    """Upload ảnh (JPG/PNG/WebP, ≤10MB). Kiểm tra magic bytes, không tin Content-Type."""
    prop = await _get_property_or_404(db, property_id)
    await ensure_permission(db, user, prop.org_id, Perm.PROPERTY_WRITE)

    data = await file.read(MAX_IMAGE_BYTES + 1)
    try:
        ext = detect_image_ext(data)
    except InvalidImageError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(exc)) from exc

    storage = get_storage()
    stored_name = await storage.save(data, ext)
    next_order = (
        await db.scalar(
            select(func.coalesce(func.max(PropertyImage.sort_order), -1)).where(
                PropertyImage.property_id == property_id
            )
        )
    ) + 1
    image = PropertyImage(
        property_id=property_id,
        stored_name=stored_name,
        original_name=file.filename,
        alt=alt,
        sort_order=next_order,
    )
    db.add(image)
    await db.commit()
    return PropertyImageOut(
        id=image.id, url=storage.public_url(stored_name), alt=alt, sort_order=next_order
    )


@router.delete("/property-images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_image(
    image_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    image = await db.get(PropertyImage, image_id)
    if image is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Ảnh không tồn tại")
    prop = await _get_property_or_404(db, image.property_id)
    await ensure_permission(db, user, prop.org_id, Perm.PROPERTY_WRITE)
    stored_name = image.stored_name
    await db.delete(image)
    await db.commit()
    await get_storage().delete(stored_name)


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
