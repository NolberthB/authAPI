# authAPI

**A learning-focused authentication REST API built with Node.js, Express, PostgreSQL, and JWT.**

This project demonstrates user registration and login, server-side password hashing, input validation, database persistence, error handling, and cookie-based token issuance. It is a backend engineering project rather than a production-ready identity platform.

> **Implementation status:** Registration and login are wired and use PostgreSQL. JWT verification and role-checking middleware exist in the repository but are **not connected to the current routes**. See [Security & known limitations](docs/SECURITY.md) before deploying or reusing any security-sensitive parts.

## Features implemented

- Register a user with a username, password, and a `user` or `admin` role.
- Validate incoming registration requests with `express-validator` and Joi; validate login input with Joi.
- Hash stored passwords with bcrypt.
- Authenticate credentials and issue a JWT with a **1-hour expiration**.
- Deliver the JWT in an `HttpOnly` cookie with `SameSite=Strict` and `Secure` enabled when `NODE_ENV=production`.
- Persist user records in PostgreSQL using Sequelize; synchronize models on startup.
- Return structured errors from a centralized Express error handler.

**Not currently implemented as working endpoints:** logout, refresh-token rotation, OAuth, MFA, verified role-based authorization, or a protected user-profile endpoint.

## Technology stack

| Area | Technology |
| --- | --- |
| Runtime and API | Node.js, Express 4 |
| Database (active) | PostgreSQL, Sequelize |
| Authentication | JSON Web Tokens (`jsonwebtoken`), bcrypt |
| Validation | Joi, express-validator |
| Middleware | cookie-parser, custom error handling |
| Alternative database (inactive) | MongoDB / Mongoose source files |

## Getting started

### Prerequisites

- Node.js with `--watch` support (Node.js 20+ recommended)
- npm (the repository also includes a Bun lockfile)
- A running PostgreSQL instance

### Install

```bash
git clone https://github.com/NolberthB/authAPI.git
cd authAPI
npm install
```

### Configure the environment

Create a local `.env` file at the repository root. **Do not commit it or use real secrets in documentation.** Example:

```dotenv
NODE_ENV=development
PORT=3000
POSTGRES_URI=postgres://app_user:replace_password@localhost:5432/authapi
MONGO_URI=mongodb://127.0.0.1:27017/authapi
SALT_ROUNDS=10
SECRET_JWT_KEY=replace_with_a_long_random_secret
```

All **six** variables are currently marked as required by `src/configs/env.js`. In particular, `MONGO_URI` is required at validation time **even though MongoDB is not connected by the active startup path**, and `PORT` and `SALT_ROUNDS` are marked required despite also having schema defaults.

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Runtime environment; `development` enables verbose error information |
| `PORT` | Port used by the HTTP server |
| `POSTGRES_URI` | PostgreSQL connection URI used at startup |
| `MONGO_URI` | Required by environment validation; MongoDB is not active |
| `SALT_ROUNDS` | Numeric bcrypt cost factor |
| `SECRET_JWT_KEY` | Secret used to sign and verify JWTs; never expose it |

### Start

```bash
npm run dev
```

This runs `node --watch src/index.js`. At startup, the application validates environment variables, authenticates to PostgreSQL, runs `sequelize.sync({ force: false })`, registers middleware and routes, and listens on `PORT`. The process exits if environment validation or the database connection fails.

**Smoke test:**

```bash
curl http://localhost:3000/
```

Expected response:

```json
{"message":"Hello API Auth Service"}
```

## HTTP endpoints

| Method | Path | Purpose | Authentication required? |
| --- | --- | --- | --- |
| `GET` | `/` | Health-style greeting (not a DB health check) | No |
| `POST` | `/auth/register` | Register a user | No |
| `POST` | `/auth/login` | Verify credentials and issue an access-token cookie | No |

Example registration:

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"example-password","role":"user"}'
```

Example login (save the returned cookie locally):

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","password":"example-password"}'
```

> **Security warning:** The current public registration endpoint accepts `role: "admin"`. Do **not** expose this project to untrusted traffic without addressing that behavior. Saving the cookie does not give access to a protected route in the current implementation.

For actual response shapes, validation rules, and caveats, read [API reference](docs/API.md).

## Architecture

```text
src/
├── index.js                 # Express bootstrap and active route registration
├── configs/
│   ├── env.js               # Joi validation of environment variables
│   └── db/
│       ├── postgresDB.js    # Active Sequelize connection and synchronization
│       └── mongoDB.js       # Alternative connector (not used at startup)
├── routers/authRouters.js   # /auth/register and /auth/login
├── controller/              # HTTP controllers
├── services/authServices.js # Registration / login business logic
├── models/                  # Sequelize user model and alternative Mongoose model
├── validations/             # Joi and express-validator rules
├── middlewares/             # JWT, role checks, and centralized error handler
├── errors/index.js          # Application error classes
└── utils/logStartupError.js # Startup error logging
```

Read [Architecture](docs/ARCHITECTURE.md) for request flows, design notes, and inactive modules.

## Documentation

- [API reference](docs/API.md) — endpoints, payloads, cookie behavior, and errors
- [Architecture](docs/ARCHITECTURE.md) — project structure, data flow, and persistence
- [Security & known limitations](docs/SECURITY.md) — verified gaps, risks, and scope boundaries

## Development notes

- The checked-in `package.json` defines **only** the `dev` script; it does not currently define `test`, `build`, or `start` scripts.
- No automated test suite is present in the reviewed repository.
- No deployment URL or production-readiness claim is made by this documentation.
- Documentation reflects the source available on the `main` branch when the `docs` branch was created (October 2026). It does not imply that known issues were fixed.

**Author:** [Nolberto Betancourt](https://github.com/NolberthB) · [LinkedIn](https://www.linkedin.com/in/nolberthb/)

