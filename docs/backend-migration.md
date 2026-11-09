# PostgreSQL migration, cutover and rollback

The Node backend uses the same PostgreSQL tables, identifiers, enum values,
`numeric(12,0)` money fields, foreign keys, indexes and booking-night uniqueness
as the Python release. The baseline is Alembic head **`1fbacdbbe084`**, following
`dacb56ff968b` and `351b802d83ed`. The retained files in `backend/migrations/`
and the preceding Git revision are the historical compatibility reference.
The new service, database CLI, tests and deployed application require Node and
PostgreSQL; none invoke Python, SQLAlchemy, Alembic or FastAPI.

## Fresh development database

From the repository root, start PostgreSQL with `docker compose up -d db`.
From `backend/`, run:

```sh
npm ci
npm run db:migrate
npm run db:seed
# Optional, only in a development/demo database:
npm run db:seed -- --demo
npm run dev
```

The default database URL is the local Docker development database. Set
`HOMESTAY_DATABASE_URL` explicitly for any other target. Legacy
`postgresql+asyncpg://` and `postgresql+psycopg://` URLs are normalized to
`postgresql://`. The migration user needs ownership of the application schema
and permission to create a temporary schema; runtime credentials may have
fewer privileges. Schema initialization and validation run in one transaction,
under a PostgreSQL advisory lock. Startup does not migrate or seed implicitly.

Core seeding only inserts absent roles and amenities. It preserves customized
role permissions and labels. `--demo` explicitly adds the legacy Gaoji example
organization, accounts, five units, rooms, amenities, services, inquiry and lease.
It does not reset existing passwords, permissions, prices, descriptions or
operational statuses; existing users do not gain owner memberships on reruns.
Never use the demo command against a production database. The example account
`owner@example.com` has the development password `demo12345`.

## Rehearse an existing database

1. Take a PostgreSQL backup using your normal encrypted backup process. Restore
   it to an isolated rehearsal database. Copy local uploads to an isolated
   directory, or retain read-only access to the established public R2 URLs.
2. Check `SELECT version_num FROM alembic_version`: exactly one row must contain
   `1fbacdbbe084`. If the restored database is older, upgrade it using the
   retained legacy release and its migration history before using the Node CLI.
   Do not stamp an older or partial schema as current.
3. Point `HOMESTAY_DATABASE_URL` at the restored database. Record representative
   user, organization, property, booking-code, inquiry, service, lease and image
   identifiers and their relevant values; record counts for every application
   table. Keep this evidence private because it may contain customer data.
4. Run `npm run db:migrate`. Existing creation migrations are never replayed.
   The CLI requires the recognized Alembic head, creates a temporary reference
   schema from frozen SQL, and compares every baseline column, default, type,
   nullability, index, constraint and enum against PostgreSQL's definitions.
   A mismatch aborts and rolls back; investigate drift rather than dropping or
   resetting data. Do not alter the frozen baseline to silence a mismatch.
5. The only durable addition to a compatible database is `node_migrations`,
   containing version `001_legacy_baseline`, its SHA-256 checksum and timestamp.
   The original Alembic marker remains intact. Run migration a second time to
   verify repeatability. Confirm the recorded identifiers, counts and values
   are unchanged. Core seed is optional; demo seed is not part of migration.
6. Retain the JWT secret, token expiry and booking settings. Verify an existing
   account/password, an unexpired pre-migration HS256 token, booking-code lookup,
   existing local/R2 image URLs and representative administrative workflows.
   Run the documented HTTP/PostgreSQL integration suite in its isolated test
   database, then the frontend/backend smoke command against the rehearsal
   service. Frontend offline fallback data is not evidence of API compatibility.

Built deployments can use `node dist/db/migrate.js` and, when intentionally
needed, `node dist/db/seed.js`; include `dist/db/baseline.sql` in the artifact.
Commit a new, ordered migration for future schema changes; never rewrite the
released baseline or an applied checksum.

## Cutover checklist

Production timing and downtime must be agreed with the operator; these commands
do not execute a production cutover. Prepare the previous release artifact,
database backup and routing rollback before scheduling one.

1. Verify the rehearsal, backend checks, frontend checks and restored backup.
2. Preserve the existing database, JWT secret, CORS origins, storage settings,
   object prefixes and public asset base URL. Keep upload directories durable
   and reachable at their existing `/uploads/` paths. Do not move or rename R2
   objects. Configure Node's port to match the existing proxy upstream.
3. Pause scheduled expiry and application writers for the agreed window; stop
   the old backend before routing writes to the new one. Take the final backup.
4. Run the Node migration CLI once with migration credentials. Deploy the built
   service with runtime credentials and check `GET /health`.
5. Verify login, catalog, images, guest checkout, booking lookup and an allowed
   staff operation through the actual proxy. Run the frontend smoke check
   against the real API, then resume the repeatable
   `POST /api/v1/internal/expire-bookings` schedule.
6. Monitor HTTP errors, booking conflicts, expiry processing and PostgreSQL
   connections. Retain the previous release until the observation period ends.

## Rollback

Stop the Node writers and expiry schedule, then restore routing to the previous
Python release with the same database, upload paths and configuration. This
baseline makes no application-schema or record changes, so its extra
`node_migrations` table can remain: the old release ignores it and still sees
the original Alembic head. Existing bcrypt hashes, tokens, booking codes and
R2 keys remain usable. Resume the previous expiry schedule and verify health,
login, lookup and availability. Retain the failed release logs for diagnosis.

Do not restore an old backup over new accepted bookings merely to switch
application releases. If corruption is suspected, stop writers and follow the
operator's incident recovery process, reconciling writes since the backup.
Future migrations must each include their own compatibility and rollback plan.
