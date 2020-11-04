import express from 'express'
import { router as todosRouter } from '../src/TodosApi/express-app'
import { router as usersRouter } from '../src/UsersApi/express-app'
import { router as settingsRouter } from '../src/SettingsApi/express-app'

const app = express()

app.use('/settings-api', settingsRouter)
app.use('/todos-api', todosRouter)
app.use('/users-api', usersRouter)

app.listen(8080, () => console.log('Listening on 8080'))
