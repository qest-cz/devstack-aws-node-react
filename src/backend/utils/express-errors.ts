import { NextFunction, Request, Response } from 'express'

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        console.log(err)

        return res.status(500).json({
            message: err.message || 'internal server error',
        })
    }

    return res.status(500).json({
        message: 'unhandled request',
    })
}

process.on('unhandledRejection', (error: any) => {
    console.log(`Unhandled rejection: `, error)
    if (error instanceof Error) {
        throw error
    } else {
        throw new Error(error as any)
    }
})
