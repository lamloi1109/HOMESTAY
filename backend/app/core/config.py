from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="HOMESTAY_", extra="ignore")

    app_name: str = "Homestay Booking API"
    debug: bool = False

    # 127.0.0.1 thay vì localhost: tránh resolve sang ::1 (IPv6) treo trên Windows.
    database_url: str = "postgresql+asyncpg://homestay:homestay@127.0.0.1:5432/homestay"

    jwt_secret: str = "dev-only-secret-change-in-production-0123456789"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    # KE_HOACH Phase 2: soft-hold TTL — booking pending quá hạn tự expire, nhả phòng.
    booking_hold_minutes: int = 15
    # Chặn booking quá dài để giới hạn phạm vi lock/insert mỗi transaction.
    max_booking_nights: int = 30

    cors_origins: list[str] = ["http://localhost:3000"]

    # Local remains available for development/tests; production can use Cloudflare R2.
    storage_backend: Literal["local", "r2"] = "local"
    upload_dir: str = "uploads"
    r2_endpoint_url: str | None = None
    r2_access_key_id: str | None = None
    r2_secret_access_key: str | None = None
    r2_bucket_name: str | None = None
    r2_public_url: str | None = None
    r2_key_prefix: str = "property-images"


@lru_cache
def get_settings() -> Settings:
    return Settings()
