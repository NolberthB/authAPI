# API reference

> **Base URL (local):** `http://localhost:3000`, or substitute the port configured in `PORT`. This reference describes the routes actually registered in `src/index.js` and `src/routers/authRouters.js`. It is not a specification for endpoints that have yet to be built.

## Overview

| Method | Path | Controller | Request body | Success |
| --- | --- | --- | --- | --- |
| `GET` | `/` | Inline route in `src/index.js` | None | HTTP 200, greeting JSON |
| `POST` | `/auth/register` | `register` | `username`, `password`, `role` | HTTP 200, `{ "id": ... }` |
| `POST` | `/auth/login` | `login` | `username`, `password` | HTTP 200, `{ "user": ... }` + cookie |

The application registers `express.json()` and `cookieParser()` before the routes. These three endpoints do **not** use the authentication or role-authorization middleware.

## GET /

Simple application greeting; does not test connectivity to the database.

**Request**

```bash
curl -i http://localhost:3000/
```

**Response (200)**

```json
{
  "message": "Hello API Auth Service"
}
```

## POST /auth/register

Creates a new user in the active PostgreSQL database. The implementation first checks whether a user with that username already exists, hashes the password with bcrypt, then creates a Sequelize `User` record.

**JSON request**

```json
{
  "username": "demo_user",
  "password": "example-password",
  "role": "user"
}
```

### Validation

There are **two validation stages**:

1. Route middleware (`express-validator`) checks that `username` exists and is non-empty, and `password` exists, is non-empty, and is a string. This middleware returns **HTTP 403** with an `errors` array when its checks fail (this is the current behavior, not a recommendation for API design).
2. Service layer (`Joi`) requires:
   - `username`: string, minimum 3 characters;
   - `password`: string, minimum 6 characters;
   - `role`: required, exactly `user` or `admin`.

When Joi rejects the request, the service throws `ValidationError` (status 400), handled by the central error middleware.

**Request**

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"example-password","role":"user"}'
```

**Success (HTTP 200)**

```json
{
  "id": 1
}
```

The integer shown above is an **illustrative ID**; the database assigns the actual value. The handler uses `res.send` without an explicit 201 status.

**Possible errors based on the code**

| Status | Trigger | Shape |
| --- | --- | --- |
| 403 | Express-validator reports missing or malformed required fields | `{"errors":[...]}` |
| 400 | Joi validation fails (for example, missing `role` or short username) | `{"error":"Invalid register input","stack":""}` in production |
| 409 | Username found before insert | `{"error":"Username already exists","stack":""}` in production |
| 500 | Unexpected database/server error | Generic error response in production |

Errors in development can also include a `stack` property with stack details. The exact shape of Express-validator's `errors` array depends on the failed rule.

**Important security limitation:** The client currently chooses `role`, including `admin`; registration does not enforce a safe default role. See [Security & known limitations](SECURITY.md).

## POST /auth/login

Verifies a username and password against PostgreSQL. The service checks the plaintext password with `bcrypt.compare` against the stored hash and returns user data excluding the password. The controller signs a JWT with `expiresIn: '1h'` and sets an access-token cookie.

**JSON request**

```json
{
  "username": "demo_user",
  "password": "example-password"
}
```

**Validation (Joi)**

Both fields are required strings. There is no minimum password length in the login schema.

**Request**

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"example-password"}'
```

**Success (HTTP 200, example)**

```json
{
  "user": {
    "id": 1,
    "username": "demo_user",
    "role": "user",
    "createdAt": "2026-10-20T00:00:00.000Z",
    "updatedAt": "2026-10-20T00:00:00.000Z"
  }
}
```

The record's ID and timestamps are illustrative. The actual response is the Sequelize model serialized to a plain object with `password` removed; fields depend on the current model/database schema.

**Set-Cookie**

```http
Set-Cookie: access_token=<signed-token>; Max-Age=3600; Path=/; HttpOnly; SameSite=Strict
```

- Cookie name: `access_token`.
- JavaScript access: restricted by `HttpOnly`.
- `Secure`: enabled when `NODE_ENV=production`.
- `SameSite`: `strict`.
- Max age: 3,600 seconds (one hour).
- JWT expiration: one hour.
- The controller does **not** expose a `/me`, `/refresh`, or `/logout` endpoint.

**Known mismatch:** The currently unused `protect` middleware reads `req.cookies.token` rather than `req.cookies.access_token`. Also, the JWT payload uses `user._id`, while the active Sequelize model exposes `id`; the `id` claim may be missing. Those are implementation limitations, **not instructions to clients to rely on broken behavior**.

**Possible errors**

| Status | Trigger | Result |
| --- | --- | --- |
| 400 | Joi input validation fails | Error: `Invalid login input` |
| 404 | No matching username | Error: `Username does not exist` |
| 401 | Incorrect password | Error: `Password is invalid` |
| 500 | Unexpected execution failure | Error response from centralized handler |

The response for errors comes from `src/middlewares/errorHandler.js`. For errors classified as known, production returns `{ "error": message, "stack": "" }`; otherwise it hides the message behind a generic Spanish error string. Implementation inconsistencies with some custom error classes are described in [Security & known limitations](SECURITY.md).

## Nonexistent or unregistered endpoints

The code contains a `getAll` controller plus JWT and role middleware, but **no HTTP route invokes them**. Do not infer the following exist from file names: `GET /users`, `GET /auth/me`, `POST /auth/logout`, or any admin-only route.

## Operational guidance

- Use `Content-Type: application/json` for POST requests.
- Keep the `SECRET_JWT_KEY` private.
- Use a local database and test credentials. The current project must not be treated as a deployed authentication service.
- See [README](../README.md) for environment setup and [Architecture](ARCHITECTURE.md) for execution flow.

