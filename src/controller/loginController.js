import jwt from 'jsonwebtoken'

import { authService } from '../services/authServices.js'
import { SECRET_JWT_KEY } from '../configs/env.js'

export const login = async (req, res) => {
  const { username, password, role } = req.body

  try {
    const user = await authService.login({ username, password, role })
    const token = jwt.sing(
      { id: user._id, username: user.username, role: user.role },
      SECRET_JWT_KEY,
      {
        expireIn: '1h'
      })

    res
      .cookie('access_token', token, {
        httpOnly: true, // la cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV === 'production', // la cookie solo se puede acceder en https
        sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60 // la cookie solo tiene validez 1 hora
      })
      .send({ user })
  } catch (error) {
    // TODO: Manejar errores
    res.status(400).send(error.message)
  }
}
