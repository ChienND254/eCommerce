import { createClient } from 'redis';

class RedisPubSubService {
    private subscriber: any;
    private publisher: any;

    constructor() {
        this.subscriber = createClient();
        this.publisher = this.subscriber.duplicate();
        this.subscriber.connect()
        this.publisher.connect()
    }

    publish(channel: string, message: string) {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err: any, reply: unknown) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }
            })
        })
    }

    subscribe(channel: string, callback: any) {
        this.subscriber.subscribe(channel,  (messageString:string, channelString:string) => {
            if(channel === channelString) {
                callback(channel, messageString)
            }
        })
    }
}

export default new RedisPubSubService();