-- Frozen from the three retained Alembic upgrade revisions; do not edit after release.

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> dacb56ff968b

CREATE TABLE amenities (
    code VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(64),
    group_name VARCHAR(120) NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (code)
);

CREATE TABLE organizations (
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (slug)
);

CREATE TABLE roles (
    code VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    permissions JSONB NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (code)
);

CREATE TABLE users (
    email VARCHAR(320) NOT NULL,
    hashed_password VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    is_active BOOLEAN NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email)
);

CREATE TABLE audit_logs (
    org_id UUID,
    actor_user_id UUID,
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    data JSONB,
    ip VARCHAR(64),
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(actor_user_id) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE SET NULL
);

CREATE INDEX ix_audit_entity ON audit_logs (entity_type, entity_id);

CREATE INDEX ix_audit_org_created ON audit_logs (org_id, created_at);

CREATE TYPE property_status AS ENUM ('draft', 'active', 'inactive');

CREATE TABLE properties (
    org_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    city VARCHAR(120),
    status property_status NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE CASCADE,
    CONSTRAINT uq_property_org_slug UNIQUE (org_id, slug)
);

CREATE TABLE user_org_roles (
    user_id UUID NOT NULL,
    org_id UUID NOT NULL,
    role_id UUID NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES roles (id) ON DELETE RESTRICT,
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_org UNIQUE (user_id, org_id)
);

CREATE TABLE property_amenities (
    property_id UUID NOT NULL,
    amenity_id UUID NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(amenity_id) REFERENCES amenities (id) ON DELETE CASCADE,
    FOREIGN KEY(property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT uq_property_amenity UNIQUE (property_id, amenity_id)
);

CREATE TABLE room_types (
    property_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(12, 0) NOT NULL,
    capacity_adults INTEGER NOT NULL,
    capacity_children INTEGER NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(property_id) REFERENCES properties (id) ON DELETE CASCADE
);

CREATE TABLE price_rules (
    room_type_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_start DATE,
    date_end DATE,
    weekday_mask INTEGER,
    price NUMERIC(12, 0) NOT NULL,
    priority INTEGER NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(room_type_id) REFERENCES room_types (id) ON DELETE CASCADE
);

CREATE INDEX ix_price_rules_room_type ON price_rules (room_type_id);

CREATE TYPE room_status AS ENUM ('active', 'maintenance');

CREATE TABLE rooms (
    room_type_id UUID NOT NULL,
    code VARCHAR(64) NOT NULL,
    status room_status NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(room_type_id) REFERENCES room_types (id) ON DELETE CASCADE,
    CONSTRAINT uq_room_code UNIQUE (room_type_id, code)
);

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'expired');

CREATE TABLE bookings (
    code VARCHAR(20) NOT NULL,
    org_id UUID NOT NULL,
    property_id UUID NOT NULL,
    room_id UUID NOT NULL,
    user_id UUID,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(320) NOT NULL,
    guest_phone VARCHAR(32),
    num_guests INTEGER NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status booking_status NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    version INTEGER NOT NULL,
    total_amount NUMERIC(12, 0) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    note VARCHAR(1000),
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE RESTRICT,
    FOREIGN KEY(property_id) REFERENCES properties (id) ON DELETE RESTRICT,
    FOREIGN KEY(room_id) REFERENCES rooms (id) ON DELETE RESTRICT,
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE SET NULL,
    UNIQUE (code)
);

CREATE INDEX ix_bookings_org ON bookings (org_id);

CREATE INDEX ix_bookings_status_expires ON bookings (status, expires_at);

CREATE TABLE booking_nights (
    id UUID NOT NULL,
    booking_id UUID NOT NULL,
    room_id UUID NOT NULL,
    night DATE NOT NULL,
    price NUMERIC(12, 0) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
    FOREIGN KEY(room_id) REFERENCES rooms (id) ON DELETE RESTRICT,
    CONSTRAINT uq_room_night UNIQUE (room_id, night)
);

CREATE INDEX ix_booking_nights_booking ON booking_nights (booking_id);

CREATE TYPE payment_provider AS ENUM ('vnpay', 'momo', 'manual');

CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');

CREATE TABLE payments (
    booking_id UUID NOT NULL,
    provider payment_provider NOT NULL,
    status payment_status NOT NULL,
    amount NUMERIC(12, 0) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    provider_txn_id VARCHAR(255),
    idempotency_key VARCHAR(255),
    raw_ipn JSONB,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(booking_id) REFERENCES bookings (id) ON DELETE RESTRICT,
    UNIQUE (booking_id),
    UNIQUE (idempotency_key)
);

CREATE TABLE ledger_entries (
    txn_group_id UUID NOT NULL,
    org_id UUID NOT NULL,
    account VARCHAR(64) NOT NULL,
    booking_id UUID,
    payment_id UUID,
    debit NUMERIC(12, 0) NOT NULL,
    credit NUMERIC(12, 0) NOT NULL,
    memo VARCHAR(500),
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT ck_ledger_debit_xor_credit CHECK ((debit = 0) <> (credit = 0)),
    CONSTRAINT ck_ledger_non_negative CHECK (debit >= 0 AND credit >= 0),
    FOREIGN KEY(booking_id) REFERENCES bookings (id) ON DELETE RESTRICT,
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE RESTRICT,
    FOREIGN KEY(payment_id) REFERENCES payments (id) ON DELETE RESTRICT
);

CREATE INDEX ix_ledger_org ON ledger_entries (org_id);

CREATE INDEX ix_ledger_txn_group ON ledger_entries (txn_group_id);

INSERT INTO alembic_version (version_num) VALUES ('dacb56ff968b') RETURNING alembic_version.version_num;

-- Running upgrade dacb56ff968b -> 351b802d83ed

CREATE TABLE property_images (
    property_id UUID NOT NULL,
    stored_name VARCHAR(128) NOT NULL,
    original_name VARCHAR(255),
    alt VARCHAR(255),
    sort_order INTEGER NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(property_id) REFERENCES properties (id) ON DELETE CASCADE,
    CONSTRAINT uq_property_image_file UNIQUE (stored_name)
);

UPDATE alembic_version SET version_num='351b802d83ed' WHERE alembic_version.version_num = 'dacb56ff968b';

-- Running upgrade 351b802d83ed -> 1fbacdbbe084

ALTER TABLE properties ADD COLUMN unit_code VARCHAR(64);

ALTER TABLE properties ADD COLUMN tower VARCHAR(64);

ALTER TABLE properties ADD COLUMN floor VARCHAR(64);

ALTER TABLE properties ADD COLUMN view_type VARCHAR(120);

ALTER TABLE properties ADD COLUMN price_monthly NUMERIC(12, 0);

ALTER TABLE properties ADD COLUMN price_nightly NUMERIC(12, 0);

ALTER TABLE properties ADD COLUMN sqm INTEGER;

ALTER TABLE properties ADD COLUMN bedrooms INTEGER DEFAULT '1';

ALTER TABLE properties ADD COLUMN bathrooms INTEGER DEFAULT '1';

ALTER TABLE properties ADD COLUMN max_guests INTEGER DEFAULT '2';

ALTER TABLE properties ADD COLUMN room_layout JSON;

ALTER TABLE properties ADD COLUMN operational_status VARCHAR(64) DEFAULT 'available';

ALTER TABLE properties ADD CONSTRAINT uq_property_unit_code UNIQUE (unit_code);

CREATE TYPE inquiry_channel AS ENUM ('zalo', 'phone', 'web_form', 'wechat', 'email');

CREATE TYPE inquiry_stage AS ENUM ('new', 'talking', 'hold', 'won', 'lost');

CREATE TABLE inquiries (
    org_id UUID NOT NULL,
    property_id UUID,
    guest_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    zalo VARCHAR(64),
    email VARCHAR(255),
    checkin_date DATE,
    rental_term VARCHAR(64),
    guest_count INTEGER DEFAULT '2' NOT NULL,
    note TEXT,
    channel inquiry_channel NOT NULL,
    stage inquiry_stage NOT NULL,
    assigned_to_user_id UUID,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE CASCADE,
    FOREIGN KEY(property_id) REFERENCES properties (id) ON DELETE SET NULL,
    FOREIGN KEY(assigned_to_user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE tour_services (
    org_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(120) NOT NULL,
    price NUMERIC(12, 0) NOT NULL,
    price_unit VARCHAR(64) DEFAULT 'lần' NOT NULL,
    description TEXT,
    icon VARCHAR(64),
    is_active BOOLEAN DEFAULT 'true' NOT NULL,
    sort_order INTEGER DEFAULT '0' NOT NULL,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE CASCADE
);

CREATE TYPE residence_status AS ENUM ('registered', 'pending', 'expired');

CREATE TYPE document_status AS ENUM ('complete', 'missing');

CREATE TABLE leases (
    org_id UUID NOT NULL,
    property_id UUID NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    nationality VARCHAR(120) DEFAULT 'Việt Nam' NOT NULL,
    phone VARCHAR(32),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent NUMERIC(12, 0) NOT NULL,
    residence_status residence_status NOT NULL,
    document_status document_status NOT NULL,
    note TEXT,
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(org_id) REFERENCES organizations (id) ON DELETE CASCADE,
    FOREIGN KEY(property_id) REFERENCES properties (id) ON DELETE CASCADE
);

UPDATE alembic_version SET version_num='1fbacdbbe084' WHERE alembic_version.version_num = '351b802d83ed';
