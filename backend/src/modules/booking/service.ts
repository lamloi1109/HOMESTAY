import { randomInt, randomUUID } from 'node:crypto';
import type { Pool, PoolClient, QueryResultRow } from 'pg';
import { HttpError, transaction } from '../../core.js';

export interface BookingInput {
  room_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  num_guests: number;
  note: string | null;
}
export interface BookingRecord extends QueryResultRow {
  id: string;
  code: string;
  org_id: string;
  property_id: string;
  room_id: string;
  user_id: string | null;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  num_guests: number;
  status: string;
  expires_at: Date | null;
  version: number;
  total_amount: string;
  currency: string;
}
const bookingFields = `id, code, org_id, property_id, room_id, user_id, guest_name, guest_email,
 check_in::text, check_out::text, num_guests, status, expires_at, version, total_amount::text, currency`;
export function bookingResponse(booking: BookingRecord) {
  const { user_id: _userId, ...response } = booking;
  return response;
}

/** Atomically release exactly the bookings updated; never release a concurrently confirmed stay. */
async function expire(db: PoolClient, roomId?: string): Promise<number> {
  const updated = await db.query<{ id: string }>(`
    WITH stale AS (
      SELECT id FROM bookings WHERE status='pending' AND expires_at < clock_timestamp()
      ${roomId ? 'AND room_id=$1' : ''} FOR UPDATE ${roomId ? '' : 'SKIP LOCKED'}
    ) UPDATE bookings b SET status='expired', version=b.version+1, updated_at=now()
      FROM stale WHERE b.id=stale.id AND b.status='pending'
      AND b.expires_at < clock_timestamp() RETURNING b.id`, roomId ? [roomId] : []);
  if (updated.rows.length) await db.query('DELETE FROM booking_nights WHERE booking_id=ANY($1::uuid[])', [updated.rows.map(b => b.id)]);
  return updated.rows.length;
}

function bookingCode(): string {
  const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  return 'BK' + Array.from({ length: 8 }, () => alphabet[randomInt(alphabet.length)]).join('');
}

export async function createBooking(pool: Pool, input: BookingInput, userId: string | null, options: { bookingHoldMinutes: number; maxBookingNights: number }): Promise<BookingRecord> {
  const nights = Math.round((Date.parse(input.check_out) - Date.parse(input.check_in)) / 86400000);
  if (nights <= 0) throw new HttpError(422, 'check_out phải sau check_in');
  if (input.check_in < new Date().toISOString().slice(0, 10)) throw new HttpError(422, 'không đặt ngày quá khứ');
  if (nights > options.maxBookingNights) throw new HttpError(422, `tối đa ${options.maxBookingNights} đêm/booking`);
  try {
    return await transaction(pool, async db => {
      // All pricing, overlap checks and writes use this connection while the room row is locked.
      const roomResult = await db.query<{ id: string; status: string; room_type_id: string }>('SELECT id,status,room_type_id FROM rooms WHERE id=$1 FOR UPDATE', [input.room_id]);
      const room = roomResult.rows[0];
      if (!room) throw new HttpError(422, 'phòng không tồn tại');
      if (room.status !== 'active') throw new HttpError(422, 'phòng đang bảo trì');
      await expire(db, room.id);
      const conflicting = await db.query('SELECT id FROM booking_nights WHERE room_id=$1 AND night >= $2::date AND night < $3::date LIMIT 1', [room.id, input.check_in, input.check_out]);
      if (conflicting.rows.length) throw new HttpError(409, 'phòng đã có người giữ trong khoảng ngày này');
      const context = (await db.query<{ property_id: string; org_id: string }>('SELECT rt.property_id,p.org_id FROM room_types rt JOIN properties p ON p.id=rt.property_id WHERE rt.id=$1', [room.room_type_id])).rows[0]!;
      // PostgreSQL NUMERIC handles all money and the weekday bitmask uses Monday=0.
      const quote = await db.query<{ night: string; price: string }>(`
        SELECT d.night::date::text AS night, coalesce((
          SELECT pr.price FROM price_rules pr WHERE pr.room_type_id=rt.id
            AND (pr.date_start IS NULL OR pr.date_start <= d.night::date)
            AND (pr.date_end IS NULL OR pr.date_end >= d.night::date)
            AND (pr.weekday_mask IS NULL OR (pr.weekday_mask >> (extract(isodow FROM d.night)::int-1)) & 1 = 1)
          ORDER BY pr.priority DESC, pr.created_at DESC LIMIT 1
        ),rt.base_price)::text AS price
        FROM room_types rt CROSS JOIN generate_series($2::date::timestamp,($3::date-1)::timestamp,interval '1 day') d(night)
        WHERE rt.id=$1 ORDER BY d.night`, [room.room_type_id, input.check_in, input.check_out]);
      const total = quote.rows.reduce((sum, night) => sum + BigInt(night.price), 0n).toString();
      const booking = (await db.query<BookingRecord>(`
        INSERT INTO bookings (id,code,org_id,property_id,room_id,user_id,guest_name,guest_email,guest_phone,num_guests,
          check_in,check_out,status,expires_at,version,total_amount,currency,note)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending',clock_timestamp()+($13 * interval '1 minute'),0,$14,'VND',NULL)
        RETURNING ${bookingFields}`, [randomUUID(), bookingCode(), context.org_id, context.property_id, room.id, userId,
          input.guest_name, input.guest_email, input.guest_phone, input.num_guests, input.check_in, input.check_out, options.bookingHoldMinutes, total])).rows[0]!;
      // Legacy create_booking accepted note but did not persist it; retain that contract.
      for (const night of quote.rows) {
        await db.query('INSERT INTO booking_nights (id,booking_id,room_id,night,price) VALUES ($1,$2,$3,$4,$5)', [randomUUID(), booking.id, room.id, night.night, night.price]);
      }
      return booking;
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      throw new HttpError(409, 'phòng đã có người giữ trong khoảng ngày này');
    }
    throw error;
  }
}

export async function getBooking(pool: Pool, id: string): Promise<BookingRecord> {
  const booking = (await pool.query<BookingRecord>(`SELECT ${bookingFields} FROM bookings WHERE id=$1`, [id])).rows[0];
  if (!booking) throw new HttpError(404, 'Không tìm thấy booking');
  return booking;
}
export async function getBookingByCode(pool: Pool, code: string): Promise<BookingRecord> {
  const booking = (await pool.query<BookingRecord>(`SELECT ${bookingFields} FROM bookings WHERE code=$1`, [code.toUpperCase()])).rows[0];
  if (!booking) throw new HttpError(404, 'Không tìm thấy booking');
  return booking;
}
export async function transitionBooking(pool: Pool, id: string, expectedVersion: number, action: 'confirm' | 'cancel'): Promise<BookingRecord> {
  return transaction(pool, async db => {
    const confirm = action === 'confirm';
    const result = await db.query<BookingRecord>(`
      UPDATE bookings SET status=$3,version=version+1,expires_at=NULL,updated_at=now()
      WHERE id=$1 AND version=$2 AND status=ANY($4::booking_status[])
      ${confirm ? 'AND expires_at >= clock_timestamp()' : ''} RETURNING ${bookingFields}`,
    [id, expectedVersion, confirm ? 'confirmed' : 'cancelled', confirm ? ['pending'] : ['pending', 'confirmed']]);
    if (!result.rows[0]) throw new HttpError(409, 'booking đã bị thay đổi bởi thao tác khác (version/status không khớp)');
    if (!confirm) await db.query('DELETE FROM booking_nights WHERE booking_id=$1', [id]);
    return result.rows[0];
  });
}
export async function expireBookings(pool: Pool): Promise<number> {
  return transaction(pool, db => expire(db));
}
export async function listBookings(pool: Pool, orgId: string, status?: string): Promise<BookingRecord[]> {
  return (await pool.query<BookingRecord>(`SELECT ${bookingFields} FROM bookings WHERE org_id=$1 ${status ? 'AND status=$2' : ''} ORDER BY created_at DESC LIMIT 200`, status ? [orgId, status] : [orgId])).rows;
}
const holdingBooking = `b.status IN ('pending','confirmed','checked_in') AND (b.status != 'pending' OR b.expires_at >= clock_timestamp())`;
export async function unavailableNights(pool: Pool, roomId: string, from: string, to: string): Promise<string[]> {
  const result = await pool.query<{ night: string }>(`SELECT bn.night::text FROM booking_nights bn JOIN bookings b ON b.id=bn.booking_id WHERE bn.room_id=$1 AND bn.night >= $2::date AND bn.night < $3::date AND ${holdingBooking} ORDER BY bn.night`, [roomId, from, to]);
  return result.rows.map(row => row.night);
}
export async function availableRooms(pool: Pool, roomTypeId: string, from: string, to: string) {
  if (!(await pool.query('SELECT id FROM room_types WHERE id=$1', [roomTypeId])).rows.length) throw new HttpError(404, 'Room type không tồn tại');
  if (from >= to) return [];
  return (await pool.query(`SELECT r.id,r.room_type_id,r.code,r.status FROM rooms r WHERE r.room_type_id=$1 AND r.status='active' AND NOT EXISTS (SELECT 1 FROM booking_nights bn JOIN bookings b ON b.id=bn.booking_id WHERE bn.room_id=r.id AND bn.night >= $2::date AND bn.night < $3::date AND ${holdingBooking}) ORDER BY r.code`, [roomTypeId, from, to])).rows;
}

