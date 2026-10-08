import asyncio
from unittest.mock import Mock

import pytest

from app.services.storage import InvalidImageError, R2Storage


@pytest.fixture
def r2_client() -> Mock:
    return Mock()


@pytest.fixture
def storage(r2_client: Mock) -> R2Storage:
    return R2Storage(
        endpoint_url="https://account.r2.cloudflarestorage.com",
        access_key_id="access-key",
        secret_access_key="secret-key",
        bucket_name="images",
        public_url="https://images.example.com/",
        key_prefix="property-images/",
        client=r2_client,
    )


def test_r2_save_uploads_with_metadata_and_returns_public_url(
    storage: R2Storage, r2_client: Mock
):
    stored_name = asyncio.run(storage.save(b"image-data", "webp"))

    assert stored_name.endswith(".webp")
    r2_client.put_object.assert_called_once_with(
        Bucket="images",
        Key=f"property-images/{stored_name}",
        Body=b"image-data",
        ContentType="image/webp",
        CacheControl="public, max-age=31536000, immutable",
    )
    assert storage.public_url(stored_name) == (
        f"https://images.example.com/property-images/{stored_name}"
    )


def test_r2_delete_uses_the_same_object_key(storage: R2Storage, r2_client: Mock):
    asyncio.run(storage.delete("abc123.jpg"))

    r2_client.delete_object.assert_called_once_with(
        Bucket="images", Key="property-images/abc123.jpg"
    )


def test_r2_rejects_untrusted_stored_name(storage: R2Storage):
    with pytest.raises(InvalidImageError):
        storage.public_url("../secret.jpg")
