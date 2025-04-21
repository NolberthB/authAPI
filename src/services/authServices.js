import bcrypt from 'bcrypt'
import { Errors } from '../errors/index.js'
import { AuthValidation } from '../validations/auth.validation.js'

import { User } from '../models/postgres/userModel.js'
import { envs } from '../configs/env.js'

export class authService {
  static async register ({ username, password, role }) {
    // Validar que el username y password cumpla con los requerimientos
    const { error } = AuthValidation.registerSchema.validate(
      { username, password, role },
      { abortEarly: false }
    )

    if (error) {
      throw new Errors.ValidationError('Invalid register input', error.details)
    }

    // Validar que el usuario no exista
    const user = await User.findOne({ where: { username } })
    if (user) throw new Errors.BusinessError('Username already exists')

    // const user = await User.findOne({ username })
    // if (user) throw new Error('username already exists')

    // hashed password
    const hashedPassword = await bcrypt.hash(password, envs.SALT_ROUNDS)

    // Crear el usuario directamente con Sequelize
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role
    })

    // Guardar el usuario en la base de datos con Mongoose
    // const savedUser = await newUser.save()

    // Devolver el ID
    return newUser.id
  }

  static async login ({ username, password, role }) {
    // Validar que username,password y role esten correctos
    const { error } = AuthValidation.loginSchema.validate(
      { username, password, role },
      { abortEarly: false }
    )
    if (error) {
      throw new Errors.ValidationError('Invalid login input', error.details)
    }

    // Validar que el usuario existe con Sequelize
    const user = await User.findOne({ where: { username } }) // <- Enstancia del modelo de Sequelize
    if (!user) throw new Errors.UserNotFoundError('Username does not exist')

    // Mongoose
    // const user = await User.findOne({ username }).lean() // lean(): devuelve un objeto js plano en lugar de un doc Mongoose
    // if (!user) throw new Error('username does not exist')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Errors.InvalidCredentialsError('Password is invalid')

    // Convertir el objeto de Sequelize a un objeto plano
    const userPlain = user.get({ plain: true })

    // Sacar el password del objeto y asignarlo a un nuevo objeto
    const { password: _, ...publicUser } = userPlain

    return publicUser // <- Devolver el usuario sin el password
  }
}

// class Validaciones {
//   static username (username) {
//     if (typeof username !== 'string') { throw new Error('username must be a string') }
//     if (username.length < 3) { throw new Error('usrname must be at least 3 characters long') }
//   }

//   static password (password) {
//     if (typeof password !== 'string') { throw new Error('password must be a string') }
//     if (password.length < 6) { throw new Error('password must be at least 6 characters long') }
//   }
// }
