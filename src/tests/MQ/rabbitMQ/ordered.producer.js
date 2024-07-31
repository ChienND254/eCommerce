'use strict'

const amqp =  require('amqplib');
async function producerOrderMessage(params) {
    const connection = await amqp.connect('amqp://guest:chien123@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })

    for (let index = 0; index < 10; index++) {
        const message = `ordered-queued-message::: ${index}`
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000);
}

producerOrderMessage().catch(err => console.error(err))