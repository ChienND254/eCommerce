import * as amqp from 'amqplib';

const runConsumer = async () => {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://guest:chien123@localhost');

        // Create a channel
        const channel = await connection.createChannel();

        // Declare a queue
        const queueName = 'hello_queue';
        await channel.assertQueue(queueName, { durable: true });

        console.log(`[*] Waiting for messages in ${queueName}. To exit press CTRL+C`);

        // Consume messages from the queue
        channel.consume(queueName, (message) => {
            if (message !== null) {
                console.log(`[x] Received '${message.content.toString()}'`);
                // Acknowledge the message
                channel.ack(message);
            }
        }, {
            noAck: true
        });

    } catch (error) {
        console.error('Error in consumer:', error);
    }
};

runConsumer();
