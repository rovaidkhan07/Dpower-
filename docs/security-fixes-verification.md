# Security fixes: verification and rollout

Branch: `fix/security-checkout-review-20261010`.

## Local service and route regressions

Requires Node.js 24 or later. No database or dependency installation is needed:

```sh
npm run test:security
```

These tests use Prisma, JWT decoding, and Next response doubles. They verify
service behavior, response field selection, session revocation decisions, and
real AES-GCM encryption/rotation. They do not prove PostgreSQL locking,
real JWT verification, or a deployed browser flow.

## Staging checks

Use a dedicated disposable Postgres database with a name containing `test`,
`staging`, or `qa`. Never use the production database.

1. Install locked dependencies with `npm ci`.
2. Apply checked-in migrations to staging with `npx prisma migrate deploy`,
   then run `npx prisma generate`. The new `sessionVersion` column must exist
   before running the updated application.
3. Run `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
4. With `ALLOW_DESTRUCTIVE_TESTS=true` set only for the isolated database,
   run `npm run test:order-status` and `npm run test:tracking`.
   These suites create and delete their own fixtures.
5. Verify a deployed staging flow: login, checkout, retry with the same key,
   tracking link, password reset, rejection of the old session, and a new login.
   Verify both customer and admin sessions after resetting an admin password.
6. Issue concurrent admin PATCH requests for processing/cancellation and check
   the saved status, stock, inventory ledger, and HTTP 409 conflicts.

Middleware checks JWT signatures for page routing; protected server APIs use
database-backed session verification and reject reset/revoked sessions.

## Tracking encryption rotation

Set server-only `TRACKING_ENCRYPTION_KEYS` to a JSON object mapping version names
to independently generated, canonical base64-encoded 32-byte keys. Set
`TRACKING_ENCRYPTION_ACTIVE_VERSION` to the version used for new orders.

Keep older keys in the object for existing orders. Before rotating `JWT_SECRET`,
set `TRACKING_LEGACY_SECRET` to the original secret used for legacy three-part
tracking ciphertexts. Changing JWT signing secrets invalidates existing sessions;
retained tracking keys allow legitimate checkout retries to recover tokens.

For compatibility, absent dedicated tracking configuration retains legacy
encryption. Configure dedicated keys before JWT rotation. This migration does not
re-encrypt existing orders automatically.

## Deployment and rollback

Deploy only after staging checks pass. The session-version migration is additive:
leave the column in place during code rollback. Retain all encryption keys needed
by orders written by either version. Do not revert to code that ignores session
versions after a security-related reset, because that would accept revoked JWTs.
