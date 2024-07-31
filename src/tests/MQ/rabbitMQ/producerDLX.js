'use strict'
const amqp =  require('amqplib');


const message = "hello";

const runProducer = async () => {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://guest:chien123@localhost');

        // Create a channel
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'
        const notiQueue = 'notificationQueueProcess'
        const notificationExchangeDLX = 'notificationExDLX'
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
        // Send a message to the queue
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        });

        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })
        await channel.bindQueue(queueResult.queue, notificationExchange)

        const msg = 'Send noti'

        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in producer:', error);
    }
};

runProducer();