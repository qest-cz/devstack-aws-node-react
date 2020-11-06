import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { errorHandler } from '../utils/express-errors'
import { addTodoHandler, findTodosHandler } from './controllers'

export const router = express()

router.use(cors())
router.use(bodyParser.json({ limit: '5mb' }))
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.json({ time: Date.now() })
})
router.post('/todos', addTodoHandler)
router.get('/todos', findTodosHandler)

router.use(errorHandler)

const app = express()
app.use(router)

export default app
