"""Image storage adapters for local development and Cloudflare R2."""

import asyncio
import secrets
import uuid
from pathlib import Path
from typing import Any, Protocol

# Magic bytes → extension. Không tin Content-Type từ client.
_SIGNATURES: list[tuple[bytes, str]] = [
    (b"\xff\xd8\xff", "jpg"),
    (b"\x89PNG\r\n\x1a\n", "png"),
    (b"RIFF", "webp"),  # RIFF....WEBP — check thêm bên dưới
]

MAX_IMAGE_BYTES = 10 * 1024 * 1024


class InvalidImageError(Exception):
    pass


def detect_image_ext(data: bytes) -> str:
    """Trả về đuôi file theo magic bytes; raise nếu không phải jpg/png/webp."""
    if len(data) > MAX_IMAGE_BYTES:
        raise InvalidImageError("Ảnh vượt quá 10MB")
    for sig, ext in _SIGNATURES:
        if data.startswith(sig):
            if ext == "webp" and data[8:12] != b"WEBP":
                continue
            return ext
    raise InvalidImageError("Chỉ nhận ảnh JPG, PNG hoặc WebP")


class StorageService(Protocol):
    async def save(self, data: bytes, ext: str) -> str:
        """Lưu file, trả về stored_name (định danh trong storage)."""
        ...

    async def delete(self, stored_name: str) -> None: ...

    def public_url(self, stored_name: str) -> str: ...


class LocalDiskStorage:
    def __init__(self, root: Path):
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)

    async def save(self, data: bytes, ext: str) -> str:
        stored_name = f"{uuid.uuid4().hex}{secrets.token_hex(4)}.{ext}"
        path = self.root / stored_name
        await asyncio.to_thread(path.write_bytes, data)
        return stored_name

    async def delete(self, stored_name: str) -> None:
        # stored_name do server sinh (hex + đuôi) — vẫn chặn path traversal cho chắc.
        path = (self.root / stored_name).resolve()
        if path.parent != self.root.resolve():
            raise InvalidImageError("Tên file không hợp lệ")
        await asyncio.to_thread(lambda: path.unlink(missing_ok=True))

    def public_url(self, stored_name: str) -> str:
        return f"/uploads/{stored_name}"


class R2Storage:
    """Cloudflare R2 adapter using its S3-compatible API."""

    def __init__(
        self,
        *,
        endpoint_url: str,
        access_key_id: str,
        secret_access_key: str,
        bucket_name: str,
        public_url: str,
        key_prefix: str = "property-images",
        client: Any | None = None,
    ) -> None:
        if not all((endpoint_url, access_key_id, secret_access_key, bucket_name, public_url)):
            raise ValueError("Thiếu cấu hình Cloudflare R2 bắt buộc")

        self.bucket_name = bucket_name
        self.public_url_base = public_url.rstrip("/")
        self.key_prefix = key_prefix.strip("/")
        if client is None:
            import boto3
            from botocore.config import Config

            client = boto3.client(
                "s3",
                endpoint_url=endpoint_url,
                aws_access_key_id=access_key_id,
                aws_secret_access_key=secret_access_key,
                region_name="auto",
                config=Config(signature_version="s3v4"),
            )
        self.client = client

    def _object_key(self, stored_name: str) -> str:
        if "/" in stored_name or "\\" in stored_name or stored_name in {"", ".", ".."}:
            raise InvalidImageError("Tên file không hợp lệ")
        return f"{self.key_prefix}/{stored_name}" if self.key_prefix else stored_name

    async def save(self, data: bytes, ext: str) -> str:
        stored_name = f"{uuid.uuid4().hex}{secrets.token_hex(4)}.{ext}"
        content_types = {"jpg": "image/jpeg", "png": "image/png", "webp": "image/webp"}
        await asyncio.to_thread(
            self.client.put_object,
            Bucket=self.bucket_name,
            Key=self._object_key(stored_name),
            Body=data,
            ContentType=content_types[ext],
            CacheControl="public, max-age=31536000, immutable",
        )
        return stored_name

    async def delete(self, stored_name: str) -> None:
        await asyncio.to_thread(
            self.client.delete_object,
            Bucket=self.bucket_name,
            Key=self._object_key(stored_name),
        )

    def public_url(self, stored_name: str) -> str:
        return f"{self.public_url_base}/{self._object_key(stored_name)}"


_storage: StorageService | None = None


def get_storage() -> StorageService:
    global _storage
    if _storage is None:
        from app.core.config import get_settings

        settings = get_settings()
        if settings.storage_backend == "r2":
            _storage = R2Storage(
                endpoint_url=settings.r2_endpoint_url or "",
                access_key_id=settings.r2_access_key_id or "",
                secret_access_key=settings.r2_secret_access_key or "",
                bucket_name=settings.r2_bucket_name or "",
                public_url=settings.r2_public_url or "",
                key_prefix=settings.r2_key_prefix,
            )
        else:
            _storage = LocalDiskStorage(Path(settings.upload_dir))
    return _storage
