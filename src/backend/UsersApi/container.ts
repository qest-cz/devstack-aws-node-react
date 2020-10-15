import Knex from 'knex'
import Config from './config'

const { host, password, user, port, database } = Config.mysql
let timeoutHandle: any
let knex: Knex | null

const destroyKnex = () => {
    console.log('disconnecting knex due to inactivity..')
    knex?.destroy().then(() => {
        console.log('knex disconnected')

        knex = null
    })
}

export const getKnex = async (): Promise<Knex> => {
    if (!knex) {
        console.log('creating knex')
        knex = Knex({
            client: 'mysql',
            connection: {
                host,
                port,
                user,
                password,
                database,
                connectTimeout: 120 * 1000,
                requestTimeout: 120 * 1000,
            },
        })

        timeoutHandle = setTimeout(destroyKnex, 5 * 1000)
    } else {
        console.log('reusing knex..')
        clearInterval(timeoutHandle)
        timeoutHandle = setTimeout(destroyKnex, 5 * 1000)
    }

    if (!(await knex.schema.hasTable('users'))) {
        await knex.schema.createTable('users', (table) => {
            table.increments('id')
            table.string('username')
            table.string('email')
            table.string('passwordhash')
        })
    }

    return knex
}
