"""API integration tests for Cloudflare R2 image upload and delete endpoints."""

import struct
import uuid
import zlib
from unittest.mock import AsyncMock, Mock, patch

import httpx
import pytest

from app.api.deps import get_current_user
from app.core.database import get_db
from app.main import app
from app.models.property import Property, PropertyImage, PropertyStatus
from app.models.user import User
from app.services import storage as storage_module
from app.services.storage import R2Storage


def make_png_bytes() -> bytes:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    idat = zlib.compress(b"\x00\xff\x00\x00")
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", idat)
        + chunk(b"IEND", b"")
    )


@pytest.fixture
def r2_s3_mock() -> Mock:
    return Mock()


@pytest.fixture
def r2_storage(r2_s3_mock: Mock) -> R2Storage:
    return R2Storage(
        endpoint_url="https://f790018d2f2c91a4cc23370a55a5ca3b.r2.cloudflarestorage.com",
        access_key_id="mock-key",
        secret_access_key="mock-secret",
        bucket_name="gaoji-photos",
        public_url="https://pub-f4801f91b77a4269828769d0b4821905.r2.dev",
        key_prefix="properties",
        client=r2_s3_mock,
    )


@pytest.mark.anyio
async def test_r2_api_upload_and_delete_with_mocked_s3(r2_storage: R2Storage, r2_s3_mock: Mock):
    prop_id = uuid.uuid4()
    org_id = uuid.uuid4()
    image_id = uuid.uuid4()

    mock_user = User(
        id=uuid.uuid4(),
        email="admin@gaojihouse.com",
        full_name="Admin",
        hashed_password="pw",
    )
    mock_prop = Property(
        id=prop_id,
        org_id=org_id,
        name="Landmark 1 Unit 29.08",
        slug="landmark-1-29-08",
        status=PropertyStatus.active,
    )

    # Setup mocked db session
    mock_db = AsyncMock()
    mock_db.get = AsyncMock(side_effect=lambda model, ident: mock_prop if model is Property else None)
    mock_db.execute = AsyncMock()
    mock_db.scalar = AsyncMock(return_value=0)
    def mock_add(entity):
        if getattr(entity, "id", None) is None:
            entity.id = uuid.uuid4()

    mock_db.add = Mock(side_effect=mock_add)
    mock_db.commit = AsyncMock()
    mock_db.delete = AsyncMock()

    storage_module._storage = r2_storage

    async def override_get_db():
        yield mock_db

    async def override_get_current_user():
        return mock_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        with patch("app.api.v1.catalog.ensure_permission", new_callable=AsyncMock):
            # 1. Upload valid PNG image
            png_data = make_png_bytes()
            response = await client.post(
                f"/api/v1/properties/{prop_id}/images",
                files={"file": ("living-room.png", png_data, "image/png")},
                data={"alt": "Phòng khách sang trọng"},
            )
            assert response.status_code == 201, response.text
            data = response.json()
            assert data["alt"] == "Phòng khách sang trọng"
            assert data["url"].startswith("https://pub-f4801f91b77a4269828769d0b4821905.r2.dev/properties/")
            assert data["url"].endswith(".png")

            # Verify S3 client was called with correct bucket, key prefix, cache-control
            r2_s3_mock.put_object.assert_called_once()
            call_kwargs = r2_s3_mock.put_object.call_args.kwargs
            assert call_kwargs["Bucket"] == "gaoji-photos"
            assert call_kwargs["Key"].startswith("properties/")
            assert call_kwargs["Key"].endswith(".png")
            assert call_kwargs["ContentType"] == "image/png"
            assert call_kwargs["CacheControl"] == "public, max-age=31536000, immutable"

            # 2. Upload invalid magic bytes returns 422
            bad_response = await client.post(
                f"/api/v1/properties/{prop_id}/images",
                files={"file": ("fake.png", b"not-a-valid-image", "image/png")},
            )
            assert bad_response.status_code == 422

            # 3. Delete property image removes DB record and purges R2 object
            mock_image = PropertyImage(
                id=image_id,
                property_id=prop_id,
                stored_name="test-stored-photo.png",
                sort_order=1,
            )
            mock_db.get = AsyncMock(
                side_effect=lambda model, ident: mock_image if model is PropertyImage else (mock_prop if model is Property else None)
            )

            del_response = await client.delete(f"/api/v1/property-images/{image_id}")
            assert del_response.status_code == 204

            mock_db.delete.assert_called_once_with(mock_image)
            r2_s3_mock.delete_object.assert_called_once_with(
                Bucket="gaoji-photos",
                Key="properties/test-stored-photo.png",
            )

    app.dependency_overrides.clear()
    storage_module._storage = None
