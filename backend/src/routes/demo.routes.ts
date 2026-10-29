
import { Router } from 'express'
import { z } from 'zod'
import { validateBody } from '../middleware/validateRequest.js'

const router = Router()

const demoSchema = z.object({
  name: z.string().trim().min(2).max(80),
})

router.post('/', validateBody(demoSchema), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Request validated successfully',
    data: req.body,
  })
})

export default router
