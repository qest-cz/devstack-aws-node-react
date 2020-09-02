import express from 'express'
import bodyParser from 'body-parser'
import { addTodoHandler, findTodosHandler } from './controllers'

export const todosApi = express()

todosApi.use(bodyParser.json({ limit: '5mb' }))
todosApi.use(bodyParser.urlencoded({ extended: true }))

todosApi.post('/todos', addTodoHandler)
todosApi.get('/todos', findTodosHandler)
