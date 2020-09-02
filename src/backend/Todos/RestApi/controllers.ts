import { Request, Response } from 'express'
import { TodoItem } from '../model'
import Config from '../../../../config'
import { docClient } from '../../../../container'

export const addTodoHandler = async (req: Request, res: Response<TodoItem>) => {
    await docClient
        .put({
            TableName: Config.todosTableName,
            Item: { ...req.body },
        })
        .promise()

    res.json(req.body)
}

export const findTodosHandler = async (req: Request, res: Response<TodoItem[]>) => {
    const todos = await docClient
        .scan({
            TableName: Config.todosTableName,
        })
        .promise()
        .then((r) => (r.Items || []) as TodoItem[])

    res.json(todos)
}
