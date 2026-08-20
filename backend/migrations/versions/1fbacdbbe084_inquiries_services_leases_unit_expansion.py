"""inquiries_services_leases_unit_expansion

Revision ID: 1fbacdbbe084
Revises: 351b802d83ed
Create Date: 2026-08-20 21:21:27.091447

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = '1fbacdbbe084'
down_revision: Union[str, None] = '351b802d83ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Expand properties table
    op.add_column('properties', sa.Column('unit_code', sa.String(length=64), nullable=True))
    op.add_column('properties', sa.Column('tower', sa.String(length=64), nullable=True))
    op.add_column('properties', sa.Column('floor', sa.String(length=64), nullable=True))
    op.add_column('properties', sa.Column('view_type', sa.String(length=120), nullable=True))
    op.add_column('properties', sa.Column('price_monthly', sa.Numeric(precision=12, scale=0), nullable=True))
    op.add_column('properties', sa.Column('price_nightly', sa.Numeric(precision=12, scale=0), nullable=True))
    op.add_column('properties', sa.Column('sqm', sa.Integer(), nullable=True))
    op.add_column('properties', sa.Column('bedrooms', sa.Integer(), server_default='1', nullable=True))
    op.add_column('properties', sa.Column('bathrooms', sa.Integer(), server_default='1', nullable=True))
    op.add_column('properties', sa.Column('max_guests', sa.Integer(), server_default='2', nullable=True))
    op.add_column('properties', sa.Column('room_layout', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    op.add_column('properties', sa.Column('operational_status', sa.String(length=64), server_default='available', nullable=True))
    op.create_unique_constraint('uq_property_unit_code', 'properties', ['unit_code'])

    # 2. Create inquiries table
    op.create_table(
        'inquiries',
        sa.Column('org_id', sa.UUID(), nullable=False),
        sa.Column('property_id', sa.UUID(), nullable=True),
        sa.Column('guest_name', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=False),
        sa.Column('zalo', sa.String(length=64), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('checkin_date', sa.Date(), nullable=True),
        sa.Column('rental_term', sa.String(length=64), nullable=True),
        sa.Column('guest_count', sa.Integer(), server_default='2', nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('channel', sa.Enum('zalo', 'phone', 'web_form', 'wechat', 'email', name='inquiry_channel'), nullable=False),
        sa.Column('stage', sa.Enum('new', 'talking', 'hold', 'won', 'lost', name='inquiry_stage'), nullable=False),
        sa.Column('assigned_to_user_id', sa.UUID(), nullable=True),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['assigned_to_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )

    # 3. Create tour_services table
    op.create_table(
        'tour_services',
        sa.Column('org_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('category', sa.String(length=120), nullable=False),
        sa.Column('price', sa.Numeric(precision=12, scale=0), nullable=False),
        sa.Column('price_unit', sa.String(length=64), server_default='lần', nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=64), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('sort_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # 4. Create leases table
    op.create_table(
        'leases',
        sa.Column('org_id', sa.UUID(), nullable=False),
        sa.Column('property_id', sa.UUID(), nullable=False),
        sa.Column('guest_name', sa.String(length=255), nullable=False),
        sa.Column('nationality', sa.String(length=120), server_default='Việt Nam', nullable=False),
        sa.Column('phone', sa.String(length=32), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('monthly_rent', sa.Numeric(precision=12, scale=0), nullable=False),
        sa.Column('residence_status', sa.Enum('registered', 'pending', 'expired', name='residence_status'), nullable=False),
        sa.Column('document_status', sa.Enum('complete', 'missing', name='document_status'), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('leases')
    sa.Enum(name='document_status').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='residence_status').drop(op.get_bind(), checkfirst=True)

    op.drop_table('tour_services')

    op.drop_table('inquiries')
    sa.Enum(name='inquiry_stage').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='inquiry_channel').drop(op.get_bind(), checkfirst=True)

    op.drop_constraint('uq_property_unit_code', 'properties', type_='unique')
    op.drop_column('properties', 'operational_status')
    op.drop_column('properties', 'room_layout')
    op.drop_column('properties', 'max_guests')
    op.drop_column('properties', 'bathrooms')
    op.drop_column('properties', 'bedrooms')
    op.drop_column('properties', 'sqm')
    op.drop_column('properties', 'price_nightly')
    op.drop_column('properties', 'price_monthly')
    op.drop_column('properties', 'view_type')
    op.drop_column('properties', 'floor')
    op.drop_column('properties', 'tower')
    op.drop_column('properties', 'unit_code')
