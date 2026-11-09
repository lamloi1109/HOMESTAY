# Backend HTTP compatibility inventory

Baseline: Python `backend/app/api/v1/*.py` and `backend/app/schemas/*.py` at
`bdd15d182bd942e9565b702b1bcc7b87fcd436db`, before the Node.js replacement (#35).
Historical source remains in Git for comparison and rollback. This inventory records
the application API, rather than the framework-generated OpenAPI documentation UI.

All application paths below are relative to `/api/v1`. `/health` and `/uploads/*`
are outside that prefix. UUIDs are JSON strings; dates are `YYYY-MM-DD`; timestamps
are timezone-aware ISO strings. PostgreSQL `numeric` amounts are JSON strings in
schema-based responses, preserving precision. Revenue explicitly returns an integer.
Unknown JSON request properties are ignored. Optional output properties are present
with JSON null where no value exists. Errors use a `detail` property; request
validation returns 422. Missing/invalid/expired bearer credentials and inactive users
return 401 for protected endpoints; organization permission failures return 403.

## Authentication and organizations

| Method/path | Authorization | Request | Success / meaningful errors |
| --- | --- | --- | --- |
| POST `/auth/register` | Public | `email`, `password` (8–128), `full_name` (1–255), optional nullable `phone` (≤32) | 201 User; 409 duplicate normalized email |
| POST `/auth/login` | Public | `email`, `password` | 200 `{access_token,token_type:"bearer"}`; 401 unknown, inactive or wrong-password account |
| GET `/auth/me` | Active account | — | 200 User |
| POST `/orgs` | Active account | `name`, `slug` (1–255, lowercase letters/digits/hyphens) | 201 `{id,name,slug}`, with owner membership created atomically; 409 slug duplicate; 500 missing seeded owner role |
| POST `/orgs/:org_id/members` | `org:manage` in org | `email`, `role_code` | 201 `{user_id,org_id,role}`; replaces an existing membership's role; 404 user; 422 role |
| GET `/orgs/:org_id/revenue` | `revenue:read` in org | — | 200 `{org_id,room_revenue,currency:"VND"}` from ledger credits to `room_revenue` |

User projection: `id,email,full_name,phone`. Email lookup is normalized lowercase.
Existing bcrypt hashes, HS256 JWT `sub` UUID and `exp` claims remain usable with
the same secret. `system:admin` bypasses individual permission checks only when
that permission belongs to a membership in the relevant organization. Membership
in a different organization grants no access.

## Catalog and property images

| Method/path | Authorization | Request/query | Success / meaningful errors |
| --- | --- | --- | --- |
| GET `/properties` | Public | — | 200 active properties in ascending creation order, each with nullable `cover_image` from first sorted image |
| GET `/properties/:property_id` | Public | — | 200 PropertyDetail (including inactive properties by ID); 404 missing property |
| POST `/orgs/:org_id/properties` | `property:write` in org | `name`,`slug`, optional nullable `description`,`address` (≤500),`city` (≤120) | 201 Property, status `active` |
| POST `/properties/:property_id/room-types` | `property:write` in property's org | `name`, positive `base_price`, optional nullable `description`, `capacity_adults` (default 2, 1–20), `capacity_children` (default 0, 0–20) | 201 RoomType; 404 property |
| POST `/room-types/:room_type_id/rooms` | `property:write` in property's org | `code` (1–64) | 201 Room with `active` status; 404 room type/property |
| GET `/amenities` | Public | — | 200 Amenity list sorted by `group_name,name` |
| PUT `/properties/:property_id/amenities` | `property:write` in property's org | `{amenity_codes:string[]}` | 200 replacement Amenity list; duplicates collapse; 422 unknown codes without changing existing links; 404 property |
| POST `/properties/:property_id/images` | `property:write` in property's org | Multipart `file`, optional `alt` | 201 Image; 422 missing file, invalid magic bytes, >10 MiB; 404 property |
| DELETE `/property-images/:image_id` | `property:write` in property's org | — | 204; 404 missing image; database metadata removed and storage object deleted |

Property projection: `id,org_id,name,slug,unit_code,tower,floor,view_type,
price_monthly,price_nightly,sqm,bedrooms,bathrooms,max_guests,room_layout,
operational_status,description,address,city,status`. Status values: `draft,active,inactive`.
Creation defaults: bedrooms 1, bathrooms 1, max_guests 2, operational_status `available`.
RoomType: `id,property_id,name,description,base_price,capacity_adults,capacity_children`.
Room: `id,room_type_id,code,status` (`active,maintenance`).
Amenity: `code,name,icon,group_name`. Image: `id,url,alt,sort_order`.
PropertyDetail adds `room_types` (each adds `rooms`), `amenities`, `images` (sort_order ascending).

Uploads trust JPEG/PNG/WebP signatures, not filename or supplied MIME. Stored names
are generated, preserving original_name metadata. Concurrent uploads serialize
`max(sort_order)+1` using the property row lock. Local URLs remain `/uploads/:name`;
R2 URLs keep the configured public base and prefix (default `properties`). R2
objects have accurate ContentType and `public, max-age=31536000, immutable` cache
control. Existing objects/keys and curated frontend asset URLs are not moved.

## Booking and availability

| Method/path | Authorization | Request/query | Success / meaningful errors |
| --- | --- | --- | --- |
| POST `/bookings` | Public; optional valid account binds user_id | `room_id,check_in,check_out,guest_name` (1–255),`guest_email`; optional nullable `guest_phone` (≤32),`note` (≤1000); `num_guests` default 1 (1–40) | 201 Booking; 422 invalid/past dates, stay over configured max, missing or maintenance room; 409 overlap |
| GET `/bookings/:code` | Public | Case-insensitive booking code | 200 Booking; 404 missing code |
| POST `/bookings/:booking_id/confirm` | `booking:write` in booking's org | `{version:integer≥0}` | 200 Booking; 404 missing; 409 stale version/state/expired hold |
| POST `/bookings/:booking_id/cancel` | Booking's account holder or `booking:write` in org | `{version:integer≥0}` | 200 Booking; 404 missing; 409 stale version/invalid state |
| GET `/orgs/:org_id/bookings` | `booking:read` in org | Optional `status` alias | 200 Booking list, creation descending, maximum 200 |
| GET `/rooms/:room_id/availability` | Public | Required `from`,`to` dates | 200 `{room_id,date_from,date_to,unavailable_nights}`; nonexistent room gives empty nights |
| GET `/room-types/:room_type_id/available-rooms` | Public | Required `check_in`,`check_out` dates | 200 Room list, sorted code; invalid range gives empty list; 404 missing room type |
| POST `/internal/expire-bookings` | Public (legacy scheduler policy) | — | 200 `{expired:integer}`, repeated calls safely return zero when none remain |

Booking projection: `id,code,org_id,property_id,room_id,guest_name,guest_email,
check_in,check_out,num_guests,status,expires_at,version,total_amount,currency`.
Enums: `pending,confirmed,checked_in,checked_out,cancelled,expired`.
Stay nights are half-open `[check_in,check_out)`. Holds default to 15 minutes and
maximum stay defaults to 30 nights; both are configuration. Pricing uses the
room-type base price with each date's override, accumulated without binary-float
money arithmetic. Codes retain `BK` plus eight unambiguous uppercase characters.
The room-row transaction lock, overlap check inside it and unique `(room_id,night)`
constraint remain in force. Stale holds are reclaimed inside a new booking attempt.
Cancellation and expiry release nights; valid confirmed and checked-in nights stay
occupied. Confirmation accepts pending holds only and clears expiry; cancellation
accepts pending/confirmed only. Successful transitions increment version. The new
service also enforces the issue's explicit requirement that an already expired hold
cannot be confirmed (the original Python confirm implementation lacked that guard).

## Public inquiries and services

| Method/path | Authorization | Request/query | Success / meaningful errors |
| --- | --- | --- | --- |
| POST `/inquiries` | Public | Required `guest_name` (1–255),`phone` (8–32); optional nullable `zalo,email,property_id,unit_code,checkin_date,rental_term,note`; `guest_count` default 2 (1–20); `channel` default `web_form` | 201 `{success:true,message,inquiry_id}`; 500 if no organization exists |
| GET `/services` | Public | Optional `category` exact match | 200 active TourService list ordered `sort_order,created_at` ascending |

Inquiry matching prefers property_id over unit_code. Missing/unmatched property
falls back to org slug `gaoji-house`, then the first org, with null property_id.
Guest name, phone, email and zalo are trimmed; missing/empty zalo falls back to
trimmed phone. New stage is `new`. Channels: `zalo,phone,web_form,wechat,email`;
stages: `new,talking,hold,won,lost`.

## Administrative operations

All `/admin/*` routes historically require an active account **only**, with no
organization permission filter. This includes accounts without a membership.
This documented compatibility policy is retained; security-policy changes require
separate scope. Public catalog writes and booking management still enforce their
organization permissions independently.

| Method/path | Request/query | Success / meaningful errors |
| --- | --- | --- |
| GET `/admin/inquiries` | Optional `stage,channel,search`; `limit` default 50 (1–100), `offset` default 0 (≥0) | 200 Inquiry list, creation descending; search is case-insensitive substring across guest_name, phone, zalo, email (legacy behavior does not search unit_code despite old route's prose) |
| GET `/admin/inquiries/:inquiry_id` | — | 200 Inquiry; 404 missing |
| PATCH `/admin/inquiries/:inquiry_id` | Optional nullable `stage,note,assigned_to_user_id,rental_term,checkin_date` | 200 Inquiry; 404 missing; explicit null values are ignored; updated_at refreshed |
| GET `/admin/units` | — | 200 Property list ordered `unit_code ASC NULLS LAST,created_at ASC` |
| GET `/admin/units/:property_id` | — | 200 PropertyDetail; 404 missing (Node explicitly projects nested data rather than relying on legacy ORM lazy serialization) |
| PATCH `/admin/units/:property_id` | Optional nullable `price_monthly,price_nightly,operational_status,description,status,view_type,sqm,bedrooms,bathrooms,max_guests,room_layout` | 200 Property; 404 missing; omitted fields untouched, explicit null stored where schema permits |
| GET `/admin/services` | — | 200 all TourService records (including inactive), `sort_order,created_at` ascending |
| POST `/admin/services` | `name` (1–255),`category` (1–120), nonnegative `price`; `price_unit` default `lần` (≤64), nullable optional `description,icon`; `is_active` default true, `sort_order` default 0 | 201 TourService; org chosen by gaoji-house/first fallback; 400 no org |
| PATCH `/admin/services/:service_id` | Optional nullable `name,category,price,price_unit,description,icon,is_active,sort_order` | 200 TourService; 404 missing; omitted fields untouched, explicit null passed to persistence |
| DELETE `/admin/services/:service_id` | — | 204; 404 missing |
| GET `/admin/leases` | Optional integer `expiring_days` | 200 Lease list ordered end_date ascending; filter retains inclusive `0≤days_remaining≤expiring_days` |
| POST `/admin/leases` | `property_id,guest_name` (1–255),`start_date,end_date`, positive `monthly_rent`; `nationality` default `Việt Nam` (≤120), nullable optional `phone` (≤32),`note`; `residence_status` default `pending`, `document_status` default `complete` | 201 Lease using property's org; 404 property |
| PATCH `/admin/leases/:lease_id` | Optional nullable `guest_name,nationality,phone,start_date,end_date,monthly_rent,residence_status,document_status,note` | 200 Lease; 404 missing; omitted fields untouched, explicit null passed to persistence |

Inquiry projection: `id,org_id,property_id,unit_code,property_name,guest_name,phone,
zalo,email,checkin_date,rental_term,guest_count,note,channel,stage,assigned_to_user_id,
created_at,updated_at`.
TourService: `id,org_id,name,category,price,price_unit,description,icon,is_active,
sort_order,created_at,updated_at`.
Lease: `id,org_id,property_id,unit_code,property_name,guest_name,nationality,phone,
start_date,end_date,days_remaining,monthly_rent,residence_status,document_status,
note,created_at,updated_at`. `days_remaining` is end_date minus today's calendar
date. Residence values: `registered,pending,expired`; document values: `complete,missing`.

Framework-specific validation error wording is replaced by equivalent 422 errors
with a detail envelope. Database integrity violations are returned as controlled
4xx errors instead of uncaught framework 500s. These do not expand access or change
successful response projections.
