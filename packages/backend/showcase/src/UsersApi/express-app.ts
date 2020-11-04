import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Router } from 'express'
import { errorHandler } from '../utils/express-errors'
import { discovery, findUsers, runTask } from './controllers'
import Config from './config'

export const router = Router()

router.use(cors())
router.use(bodyParser.json({ limit: '10mb' }))
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.json({ time: Date.now() })
})
router.get('/discovery', discovery)
router.get('/users', findUsers)
router.get('/run-task', runTask)
router.get('/info', (req, res) => {
    res.json(Config)
})

router.use(errorHandler)

const app = express()
app.use(router)

export default app
