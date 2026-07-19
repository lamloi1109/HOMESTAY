from functools import lru_cache

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

    # Thư mục lưu ảnh upload (LocalDiskStorage — swap S3 ở phase sau).
    upload_dir: str = "uploads"


@lru_cache
def get_settings() -> Settings:
    return Settings()
