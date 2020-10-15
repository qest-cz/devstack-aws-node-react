import { createHash, randomBytes } from 'crypto'
import { SrvRecord } from 'dns'
import dns from 'dns'
import { NextFunction, Request, Response } from 'express'
import Axios from 'axios'
import { getKnex } from './container'

export const runTask = async (req: Request, res: Response, next: NextFunction) => {
    const data = randomBytes(32)

    const start = Date.now()
    let nonce = 0
    let hash = ''
    const prefixToFind = '0000'
    while (!(hash.substr(0, prefixToFind.length) === prefixToFind)) {
        hash = createHash('sha256').update(data).update(nonce.toString()).digest().toString('hex')

        nonce++
    }

    const took = Date.now() - start

    return res.json({
        hash,
        nonce,
        took,
        data: data.toString('base64'),
    })
}

export const findUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const knex = await getKnex()
        const result = await knex('users').select('*')

        return res.json(result)
    } catch (err) {
        return next(err)
    }
}

export const discovery = async (req: Request, res: Response, next: NextFunction) => {
    let dnsResponse: SrvRecord[]
    try {
        const resolveSrv: SrvRecord[] = await new Promise((resolve, reject) =>
            dns.resolveSrv('settings.todos.service', (err, addresses) =>
                err ? reject(err) : resolve(addresses),
            ),
        )

        dnsResponse = [...resolveSrv]
    } catch (err) {
        dnsResponse = [err.message]
    }

    let responses = []
    try {
        responses = await Promise.all(
            dnsResponse.map((r) =>
                Axios.get(`http://${r.name}:${r.port}`, {
                    timeout: 1000,
                })
                    .then((r) => r.data)
                    .catch((err) => err.message),
            ),
        )
    } catch (err) {
        responses = [err.message]
    }

    return res.json({ dnsResponse, responses })
}
