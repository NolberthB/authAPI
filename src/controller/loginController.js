import { authService } from '../services/authServices.js'

export const login = async (req, res) => {
  const { username, password, role } = req.body

  try {
    const user = await authService.login({ username, password, role })
    res.send({ user })
  } catch (error) {
    // TODO: Manejar errores
    res.status(400).send(error.message)
  }
}
