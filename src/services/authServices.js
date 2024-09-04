import bcrypt from 'bcrypt'

import User from '../models/userModel.js'
import { SALT_ROUNDS } from '../configs/env.js'

export class authService {
  static async register ({ username, password, role }) {
    // Validaciones (opcional: validar con zod)
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('usrname must be at least 3 characters long')

    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters long')

    // Verificar que el usuario no exista
    const user = await User.findOne({ username })
    if (user) throw new Error('username already exists')

    // hashed password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    })

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save()
    return savedUser._id
  }
}
