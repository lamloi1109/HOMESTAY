import type { Express } from 'express';
import { z } from 'zod';
import { asyncRoute, dateOnly as date, optionalUser, requirePermission, requireUser, uuid, validate, type AppContext } from '../../core.js';
import { availableRooms, bookingResponse, createBooking, expireBookings, getBooking, getBookingByCode, listBookings, transitionBooking, unavailableNights } from './service.js';
import { emailAddress } from '../../email.js';

const createSchema = z.object({
  room_id: uuid,
  check_in: date,
  check_out: date,
  guest_name: z.string().min(1).max(255),
  guest_email: emailAddress,
  guest_phone: z.string().max(32).nullable().default(null),
  num_guests: z.number().int().min(1).max(40).default(1),
  note: z.string().max(1000).nullable().default(null),
});
const transitionSchema = z.object({ version: z.number().int().min(0) });
const bookingStatus = z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'expired']);

export function registerBookings(app: Express, ctx: AppContext): void {
  app.post('/api/v1/bookings', asyncRoute(async (req, res) => {
    const input = validate(createSchema, req.body);
    const user = await optionalUser(ctx, req);
    res.status(201).json(bookingResponse(await createBooking(ctx.pool, input, user?.id ?? null, ctx.config)));
  }));
  app.get('/api/v1/bookings/:code', asyncRoute(async (req, res) => {
    res.json(bookingResponse(await getBookingByCode(ctx.pool, validate(z.string(), req.params.code))));
  }));
  for (const action of ['confirm', 'cancel'] as const) {
    app.post(`/api/v1/bookings/:booking_id/${action}`, asyncRoute(async (req, res) => {
      const user = await requireUser(ctx, req);
      const id = validate(uuid, req.params.booking_id);
      const body = validate(transitionSchema, req.body);
      const booking = await getBooking(ctx.pool, id);
      if (action === 'confirm' || booking.user_id !== user.id) {
        await requirePermission(ctx, user, booking.org_id, 'booking:write');
      }
      res.json(bookingResponse(await transitionBooking(ctx.pool, id, body.version, action)));
    }));
  }
  app.get('/api/v1/orgs/:org_id/bookings', asyncRoute(async (req, res) => {
    const user = await requireUser(ctx, req);
    const orgId = validate(uuid, req.params.org_id);
    const status = validate(bookingStatus.optional(), req.query.status);
    await requirePermission(ctx, user, orgId, 'booking:read');
    res.json((await listBookings(ctx.pool, orgId, status)).map(bookingResponse));
  }));
  app.get('/api/v1/rooms/:room_id/availability', asyncRoute(async (req, res) => {
    const roomId = validate(uuid, req.params.room_id);
    const from = validate(date, req.query.from);
    const to = validate(date, req.query.to);
    res.json({ room_id: roomId, date_from: from, date_to: to, unavailable_nights: await unavailableNights(ctx.pool, roomId, from, to) });
  }));
  app.get('/api/v1/room-types/:room_type_id/available-rooms', asyncRoute(async (req, res) => {
    const roomTypeId = validate(uuid, req.params.room_type_id);
    const from = validate(date, req.query.check_in);
    const to = validate(date, req.query.check_out);
    res.json(await availableRooms(ctx.pool, roomTypeId, from, to));
  }));
  app.post('/api/v1/internal/expire-bookings', asyncRoute(async (_req, res) => {
    res.json({ expired: await expireBookings(ctx.pool) });
  }));
}
