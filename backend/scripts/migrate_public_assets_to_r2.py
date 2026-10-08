"""Upload frontend/public/assets to Cloudflare R2 without changing object paths."""

import argparse
import mimetypes
import os
from pathlib import Path

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = REPO_ROOT / "frontend" / "public" / "assets"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--prefix", default="assets")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true", help="Upload lại object đã tồn tại")
    return parser.parse_args()


def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SystemExit(f"Thiếu biến môi trường bắt buộc: {name}")
    return value


def object_exists(client, bucket: str, key: str) -> bool:
    try:
        client.head_object(Bucket=bucket, Key=key)
        return True
    except ClientError as exc:
        status = exc.response.get("ResponseMetadata", {}).get("HTTPStatusCode")
        if status == 404:
            return False
        raise


def main() -> None:
    args = parse_args()
    source = args.source.resolve()
    if not source.is_dir():
        raise SystemExit(f"Không tìm thấy thư mục asset: {source}")

    endpoint = required_env("HOMESTAY_R2_ENDPOINT_URL")
    access_key = required_env("HOMESTAY_R2_ACCESS_KEY_ID")
    secret_key = required_env("HOMESTAY_R2_SECRET_ACCESS_KEY")
    bucket = required_env("HOMESTAY_R2_BUCKET_NAME")
    prefix = args.prefix.strip("/")
    client = boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )

    uploaded = skipped = 0
    files = sorted(path for path in source.rglob("*") if path.is_file())
    for path in files:
        relative = path.relative_to(source).as_posix()
        key = f"{prefix}/{relative}" if prefix else relative
        if not args.force and object_exists(client, bucket, key):
            print(f"SKIP   s3://{bucket}/{key}")
            skipped += 1
            continue

        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        print(f"{'DRYRUN' if args.dry_run else 'UPLOAD'} s3://{bucket}/{key}")
        if not args.dry_run:
            client.upload_file(
                str(path),
                bucket,
                key,
                ExtraArgs={
                    "ContentType": content_type,
                    "CacheControl": "public, max-age=31536000, immutable",
                },
            )
        uploaded += 1

    print(f"Hoàn tất: {uploaded} upload, {skipped} bỏ qua, {len(files)} tổng cộng")


if __name__ == "__main__":
    main()
