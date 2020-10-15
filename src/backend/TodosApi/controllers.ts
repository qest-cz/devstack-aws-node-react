import { NextFunction, Request, Response } from 'express'
import Config from '../../../config'
import { docClient } from '../../../container'
import { TodoItem } from './types'

export const addTodoHandler = async (req: Request, res: Response<TodoItem>, next: NextFunction) => {
    try {
        await docClient
            .put({
                TableName: Config.todosTableName,
                Item: { ...req.body },
            })
            .promise()

        res.json(req.body)
    } catch (err) {
        next(err)
    }
}

export const findTodosHandler = async (
    req: Request,
    res: Response<TodoItem[]>,
    next: NextFunction,
) => {
    try {
        const todos = await docClient
            .scan({
                TableName: Config.todosTableName,
            })
            .promise()
            .then((r) => (r.Items || []) as TodoItem[])

        res.json(todos)
    } catch (err) {
        next(err)
    }
}
