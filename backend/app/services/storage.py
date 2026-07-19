"""StorageService — interface lưu file, MVP dùng local disk.

Phase sau (S3-compatible theo KE_HOACH Phase 1) chỉ cần thêm S3Storage cùng
interface; bảng property_images và API không đổi.
"""

import asyncio
import secrets
import uuid
from pathlib import Path
from typing import Protocol

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


_storage: StorageService | None = None


def get_storage() -> StorageService:
    global _storage
    if _storage is None:
        from app.core.config import get_settings

        _storage = LocalDiskStorage(Path(get_settings().upload_dir))
    return _storage
