import bcrypt from 'bcrypt'
import { Errors } from '../errors/index.js'
import { AuthValidation } from '../validations/auth.validation.js'
import { ROLES } from '../utils/roles.js'

import { User } from '../models/postgres/userModel.js'
import { envs } from '../configs/env.js'
import { findUserByUsername } from '../utils/findUser.js'

export class authService {
  static async register ({ username, password }) {
    // Validar que el username y password cumpla con los requerimientos
    const { error } = AuthValidation.registerSchema.validate(
      { username, password },
      { abortEarly: false }
    )

    if (error) {
      throw new Errors.ValidationError('Invalid register input', error.details)
    }

    // Validar que el usuario no exista
    const user = findUserByUsername(username)
    if (user) throw new Errors.BusinessError('Username already exists')

    // const user = await User.findOne({ username })
    // if (user) throw new Error('username already exists')

    // hashed password
    const hashedPassword = await bcrypt.hash(password, envs.SALT_ROUNDS)

    // Crear el usuario directamente con Sequelize
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: ROLES.CUSTOMER // <- Role por defecto
    })

    // Guardar el usuario en la base de datos con Mongoose
    // const savedUser = await newUser.save()

    // Devolver el ID
    return newUser.id
  }

  static async login ({ username, password }) {
    // Validar que username,password y role esten correctos
    const { error } = AuthValidation.loginSchema.validate(
      { username, password },
      { abortEarly: false }
    )
    if (error) {
      throw new Errors.ValidationError('Invalid login input', error.details)
    }

    // Validar que el usuario existe con Sequelize
    const user = await findUserByUsername(username) // <- Enstancia del modelo de Sequelize
    if (!user) throw new Errors.UserNotFoundError('Username does not exist')

    // Mongoose
    // const user = await User.findOne({ username }).lean() // lean(): devuelve un objeto js plano en lugar de un doc Mongoose
    // if (!user) throw new Error('username does not exist')

    // Validar que la contraseña sea la correcta
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Errors.InvalidCredentialsError('Password is invalid')

    // Convertir el objeto de Sequelize a un objeto plano
    const userPlain = user.get({ plain: true })

    // Sacar el password del objeto y asignarlo a un nuevo objeto
    const { password: _, ...publicUser } = userPlain

    return publicUser // <- Devolver el usuario sin el password
  }

  static async getProfile (username) {
    // Validar que el usuario existe con Sequelize
    const user = await findUserByUsername(username)
    if (!user) throw new Errors.UserNotFoundError('Username does not exist')

    // Convertir el objeto de Sequelize a un objeto plano
    const userPlain = user.get({ plain: true })

    // Sacar el password del objeto y asignarlo a un nuevo objeto
    const { password: _, ...publicUser } = userPlain

    return publicUser // <- Devolver el usuario sin el password
  }
}
