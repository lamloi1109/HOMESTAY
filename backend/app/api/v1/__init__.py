from fastapi import APIRouter

from app.api.v1 import (
    admin_inquiries,
    admin_leases,
    admin_services,
    admin_units,
    auth,
    bookings,
    catalog,
    inquiries,
    orgs,
    services,
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(orgs.router)
api_router.include_router(catalog.router)
api_router.include_router(bookings.router)
api_router.include_router(inquiries.router)
api_router.include_router(services.router)
api_router.include_router(admin_inquiries.router)
api_router.include_router(admin_units.router)
api_router.include_router(admin_services.router)
api_router.include_router(admin_leases.router)
