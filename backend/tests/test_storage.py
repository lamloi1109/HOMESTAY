import asyncio
from unittest.mock import Mock, patch
import pytest

from app.services.storage import (
    MAX_IMAGE_BYTES,
    InvalidImageError,
    R2Storage,
    detect_image_ext,
    get_storage,
)


@pytest.fixture
def r2_client() -> Mock:
    return Mock()


@pytest.fixture
def storage(r2_client: Mock) -> R2Storage:
    return R2Storage(
        endpoint_url="https://f790018d2f2c91a4cc23370a55a5ca3b.r2.cloudflarestorage.com",
        access_key_id="access-key",
        secret_access_key="secret-key",
        bucket_name="gaoji-photos",
        public_url="https://pub-f4801f91b77a4269828769d0b4821905.r2.dev",
        key_prefix="properties",
        client=r2_client,
    )


def test_r2_save_uploads_with_metadata_and_returns_public_url(
    storage: R2Storage, r2_client: Mock
):
    stored_name = asyncio.run(storage.save(b"image-data", "webp"))

    assert stored_name.endswith(".webp")
    r2_client.put_object.assert_called_once_with(
        Bucket="gaoji-photos",
        Key=f"properties/{stored_name}",
        Body=b"image-data",
        ContentType="image/webp",
        CacheControl="public, max-age=31536000, immutable",
    )
    assert storage.public_url(stored_name) == (
        f"https://pub-f4801f91b77a4269828769d0b4821905.r2.dev/properties/{stored_name}"
    )


def test_r2_default_key_prefix_is_properties(r2_client: Mock):
    default_storage = R2Storage(
        endpoint_url="https://f790018d2f2c91a4cc23370a55a5ca3b.r2.cloudflarestorage.com",
        access_key_id="access-key",
        secret_access_key="secret-key",
        bucket_name="gaoji-photos",
        public_url="https://pub-f4801f91b77a4269828769d0b4821905.r2.dev",
        client=r2_client,
    )
    assert default_storage.key_prefix == "properties"
    assert default_storage._object_key("photo.webp") == "properties/photo.webp"


def test_r2_delete_uses_the_same_object_key(storage: R2Storage, r2_client: Mock):
    asyncio.run(storage.delete("abc123.jpg"))

    r2_client.delete_object.assert_called_once_with(
        Bucket="gaoji-photos", Key="properties/abc123.jpg"
    )


def test_r2_rejects_untrusted_stored_name(storage: R2Storage):
    with pytest.raises(InvalidImageError):
        storage.public_url("../secret.jpg")

    with pytest.raises(InvalidImageError):
        storage.public_url("subdir/secret.jpg")


def test_detect_image_ext_validates_magic_bytes():
    # JPEG
    assert detect_image_ext(b"\xff\xd8\xff\xe0\x00\x10JFIF") == "jpg"
    # PNG
    assert detect_image_ext(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR") == "png"
    # WebP
    assert detect_image_ext(b"RIFF\x20\x00\x00\x00WEBPVP8 ") == "webp"


def test_detect_image_ext_rejects_invalid_bytes():
    with pytest.raises(InvalidImageError, match="Chỉ nhận ảnh JPG, PNG hoặc WebP"):
        detect_image_ext(b"GIF89a\x01\x00\x01\x00")

    with pytest.raises(InvalidImageError, match="Chỉ nhận ảnh JPG, PNG hoặc WebP"):
        detect_image_ext(b"%PDF-1.4...")


def test_detect_image_ext_enforces_10mb_limit():
    oversized = b"\xff\xd8\xff" + b"0" * (MAX_IMAGE_BYTES + 1)
    with pytest.raises(InvalidImageError, match="Ảnh vượt quá 10MB"):
        detect_image_ext(oversized)


def test_get_storage_instantiates_r2_from_settings(r2_client: Mock):
    with patch("app.services.storage._storage", None):
        with patch("app.core.config.get_settings") as mock_settings:
            mock_settings.return_value = Mock(
                storage_backend="r2",
                r2_endpoint_url="https://f790018d2f2c91a4cc23370a55a5ca3b.r2.cloudflarestorage.com",
                r2_access_key_id="test-key",
                r2_secret_access_key="test-secret",
                r2_bucket_name="gaoji-photos",
                r2_public_url="https://pub-f4801f91b77a4269828769d0b4821905.r2.dev",
                r2_key_prefix="properties",
            )
            with patch("boto3.client", return_value=r2_client):
                storage_instance = get_storage()
                assert isinstance(storage_instance, R2Storage)
                assert storage_instance.bucket_name == "gaoji-photos"
                assert storage_instance.key_prefix == "properties"
                assert (
                    storage_instance.public_url("test.webp")
                    == "https://pub-f4801f91b77a4269828769d0b4821905.r2.dev/properties/test.webp"
                )
