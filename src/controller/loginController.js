import jwt from 'jsonwebtoken'
import { envs } from '../configs/env.js'

import { authService } from '../services/authServices.js'

export const login = async (req, res) => {
  const { username, password, role } = req.body

  try {
    const user = await authService.login({ username, password, role })
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      envs.SECRET_JWT_KEY,
      {
        expiresIn: '1h'
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
