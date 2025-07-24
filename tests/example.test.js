import request from 'supertest'
import app from '../src/app.js'
import { sequelize } from '../src/configs/db/postgresDB.js'

beforeAll(async () => {
  await sequelize.sync({ force: true })
}, 20000) // Timeout aquí

afterEach(async () => {
  const models = sequelize.models
  for (const modelName in models) {
    await models[modelName].destroy({ where: {}, force: true })
  }
}, 20000) // También puedes ponerlo aquí

afterAll(async () => {
  await sequelize.close()
}, 10000)

describe('Auth API', () => {
  // Registro de usuario exitoso
  test('debería registrar un usuario', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'Secret123!',
        role: 'admin'
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('message', 'User registered successfully')
    expect(res.body).toHaveProperty('userId')
    expect(typeof res.body.userId).toBe('number')
  }, 20000)

  // Login exitoso (con cookie)
  test('debería iniciar sesión con un usuario registrado', async () => {
    await request(app).post('/auth/register').send({
      username: 'testuser',
      password: 'Secret123!',
      role: 'admin'
    })

    const res = await request(app).post('/auth/login').send({
      username: 'testuser',
      password: 'Secret123!'
    })

    expect(res.statusCode).toBe(200)

    // Verifica la cookie
    const cookies = res.headers['set-cookie']
    expect(cookies).toBeDefined()
    expect(cookies.some(cookie => cookie.startsWith('token='))).toBe(true)

    // Opcional: verifica info del usuario si la devuelves
    expect(res.body.user).toHaveProperty('username', 'testuser')
  }, 20000)

  // Registro con usuario ya existente
  test('no debería permitir registrar un usuario con username ya existente', async () => {
    const user = { username: 'testuser', password: 'Secret123!' }

    // Registro exitoso
    await request(app).post('/auth/register').send(user)

    // Segundo intento con mismo username
    const res = await request(app).post('/auth/register').send(user)

    expect(res.statusCode).toBe(409) // o 409 si usas conflicto
    expect(res.body.message).toMatch(/Username already exists/i) // según tu mensaje de error
  })

  // Login con credenciales incorrectas
  test('no debería iniciar sesión con contraseña incorrecta', async () => {
    const user = { username: 'testuser', password: 'Secret123!' }
    await request(app).post('/auth/register').send(user)

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'WrongPassword!' })

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toMatch(/Password is invalid/i)
  })

  // Login con usuario inexistente
  test('no debería iniciar sesión con usuario que no existe', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'noexistente', password: 'Secret123!' })

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toMatch(/Username does not exist/i)
  })

  // Ruta protegida requiere cookie (autenticación)
  test('no debería acceder a ruta protegida sin token', async () => {
    const res = await request(app).get('/auth/profile')

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toMatch(/no autorizado/i)
  })

  // Logout
  test('debería cerrar sesión y eliminar cookie', async () => {
    const res = await request(app).post('/auth/logout')

    expect(res.statusCode).toBe(200)
    expect(res.headers['set-cookie'][0]).toMatch(/access_token=;/)
  })
})
