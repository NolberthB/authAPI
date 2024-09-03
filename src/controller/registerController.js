import { authService } from '../services/authServices.js'

export const register = async (req, res) => {
  const { username, password, role } = req.body

  try {
    const id = await authService.register({ username, password, role })
    console.log(id)
    res.send({ id })
  } catch (error) {
    // TODO: Manejar errores
    res.status(400).send(error.message)
  }
}
