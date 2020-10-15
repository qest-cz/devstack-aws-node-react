import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Router } from 'express'
import { errorHandler } from '../utils/express-errors'

export const router = Router()

router.use(cors())
router.use(bodyParser.json({ limit: '10mb' }))
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.json({ time: Date.now() })
})
router.get('/settings', (req, res) => res.json({ time: Date.now() }))

router.use(errorHandler)

const app = express()
app.use(router)

export default app
