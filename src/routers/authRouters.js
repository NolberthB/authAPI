import { Router } from 'express'
import controllers from '../controller/index.js'

import { validateUser } from '../validators/index.js'

const router = Router()

router.post('/login', controllers.login)
router.post('/register', validateUser, controllers.register)

export default router
