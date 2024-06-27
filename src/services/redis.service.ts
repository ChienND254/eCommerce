import { ObjectId } from 'mongoose'
import redis from 'redis'
import { promisify } from 'util'
import { reservationInventory } from '../models/repositories/inventory.repo'

const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setEx).bind(redisClient)

const acquireLock = async (productId: ObjectId, quantity: number, cartId: ObjectId) => {
    const key = `lock_v2024_${productId}`
    const retrtTimes = 10;
    const expireTime = 3000;
    for (let index = 0; index < retrtTimes; index++) {
        const result = await setnxAsync(key, expireTime)
        if (result === 1) {
            const isServersation = await reservationInventory({
                productId, quantity, cartId
            })

            if (isServersation.modifiedCount) {
                await pexpire(key, expireTime)
                return key;
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock: string) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

export { acquireLock, releaseLock }