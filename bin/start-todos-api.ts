import { todosApi } from '../src/backend/Todos/RestApi/express-app'

todosApi.listen(8080, () => console.log('Listening on 8080'))
