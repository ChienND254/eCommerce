'use strict'

const amqp =  require('amqplib');
async function consumerOrderMessage(params) {
    const connection = await amqp.connect('amqp://guest:chien123@localhost');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })
    // set prefetch to 1 ensure only one ack
    channel.prefetch(1)
    channel.consume( queueName, msg => {
        const message = msg.content.toString()

        setTimeout(() => {
           console.log('processed', message); 
           channel.ack(msg)
        }, Math.random() * 1000);
    })
}

consumerOrderMessage().catch(err => console.error(err))