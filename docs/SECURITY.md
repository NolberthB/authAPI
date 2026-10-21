# Security posture and known limitations

**Scope:** This document records observable behavior and limitations in the current `authAPI` repository, as reviewed in October 2026. It does **not** claim that security issues are fixed, nor does it change application code. The current API should be treated as a learning project, **not production-ready authentication infrastructure**.

## Implemented security-relevant controls

- **Password storage:** `bcrypt.hash(password, envs.SALT_ROUNDS)` before persistence.
- **Password verification:** `bcrypt.compare` during login.
- **Public login response:** stored `password` is removed from the Sequelize user object returned after successful login.
- **JWT expiration:** controller requests `expiresIn: '1h'`.
- **Cookie flags:** `httpOnly: true`, `sameSite: 'strict'`, and `secure` in production; cookie max age one hour.
- **Input checks:** Express-validator for register fields; Joi for register and login payloads.
- **Error handler:** hides stack traces in production (with caveats about error classification).

These controls do not, by themselves, establish a complete or secure authorization flow.

## Known gaps and risks

| Priority | Finding | Evidence in code | Impact / current status |
| --- | --- | --- | --- |
| Critical | Clients can choose `role: "admin"` during public registration | `AuthValidation.registerSchema` allows both roles, and `authService.register` persists the input role | No restriction or server-assigned default role; unsafe for public deployment |
| High | JWT payload uses an ID from the inactive MongoDB shape | `loginController.js` signs `id: user._id`, but `authService.login` returns Sequelize `id` | JWT identity claim may be missing |
| High | Authentication cookie name does not match verifier | Login sets `access_token`; `protect` reads `req.cookies.token` | The verifier would not receive the login token even if mounted |
| High | Protected routes and role checks are not wired | `authRouters.js` only registers public login/register | No currently exposed authenticated/role-restricted endpoint |
| High | Role middleware import points to a missing module | `role.middleware.js` imports `../utils/errors.js`, absent from the tree | Import fails if middleware is introduced without correcting the path |
| Medium | Username not protected by a database unique constraint | Sequelize `User` has no `unique` setting; service checks with `findOne` before `create` | Concurrent requests could bypass the application-only duplicate check |
| Medium | No abuse controls | No rate-limiting, account lockout, or login-throttling middleware registered | Brute-force protection is not implemented |
| Medium | Cookie flow lacks documented CSRF strategy | Login sets a cookie; no explicit CSRF token / origin verification middleware | Consider risks before exposing authenticated, state-changing endpoints |
| Medium | No token/session lifecycle | No logout, revocation, refresh, or active session store | Signed one-hour JWTs cannot be revoked by the provided endpoint set |
| Medium | Error class definition inconsistency | `UnauthorizedError` has the name string `'UnauthorizedError, 401'` instead of a separate default status argument | Incorrect name and default 500 status if this class is used |
| Low | Validation response conventions differ | Express-validator uses 403 while Joi uses custom validation status 400 | Clients must currently handle inconsistent validation status codes |
| Low | Unused user-list controller would return full model objects | `userController.js` calls `User.findAll()` and returns users, but has no mounted route | Must sanitize records and secure route before ever exposing it |
| Low | MongoDB connector is not active | Main entrypoint imports PostgreSQL; MongoDB connector/model unused | Do not advertise both databases as active capabilities |
| Low | No test or CI job in checked-in repository | No `test` script or test suite found | Security and behavioral expectations are not automated |

### Additional detail: errors

In `src/errors/index.js`, `UnauthorizedError` is created using a combined text string where a name and numeric argument should be separate. Its default status therefore remains 500. The error-handler's check compares `err.name` against the keys of `Errors`; the malformed name will not match.

### Additional detail: environment

The application requires `SECRET_JWT_KEY`, `POSTGRES_URI`, `NODE_ENV`, `PORT`, `SALT_ROUNDS`, and `MONGO_URI` according to the Joi environment schema. The secrets must stay out of source control and logs. `MONGO_URI` is required even though MongoDB is inactive.

`Secure` is enabled for cookies only when the environment is `production`, so local HTTP development behaves differently from HTTPS deployment. Nothing in this repository establishes production transport-security settings for a reverse proxy.

## Scope that should not be claimed in a resume or portfolio

Do **not** claim the following as completed features of this codebase:

- Fully functioning role-based access control (RBAC) over protected endpoints
- OAuth 2.0 / OpenID Connect, multi-factor authentication, or SSO
- Refresh-token rotation, explicit logout, revocation, or session management
- Production deployment hardening, security testing, or penetration testing
- Successful automated tests or CI/CD pipelines

A defensible project description is:

> Developed a Node.js/Express authentication REST API with PostgreSQL/Sequelize, bcrypt password hashing, JWT issuance through HTTP-only cookies, and Joi/express-validator input validation.

That statement reflects currently implemented features without implying secure, end-to-end authorization.

## Suggested next steps (not implemented)

These are **recommendations only**; this documentation branch intentionally does not change code.

1. Assign the least-privileged role server-side during registration; provide a separate authorized elevation path.
2. Align JWT subject/ID claims with the PostgreSQL user model.
3. Use consistent access-token cookie handling and mount authentication on genuinely protected routes.
4. Repair role-middleware imports and enforce permissions using a documented matrix and tests.
5. Add a database-level unique index on username and handle conflicts.
6. Add authentication and authorization tests for happy paths, invalid credentials, expired JWTs, and unauthorized access.
7. Introduce rate limiting, logging/monitoring, and a coherent session/CSRF strategy as requirements dictate.
8. Document an approved deployment architecture and run a security review before processing real user accounts.

For actual endpoint behavior see [API reference](API.md); for system flow see [Architecture](ARCHITECTURE.md).

