import * as amqp from 'amqplib';


const message: string = "hello";

const runProducer = async () => {
    try {
        // Connect to RabbitMQ server
        const connection = await amqp.connect('amqp://guest:chien123@localhost');

        // Create a channel
        const channel = await connection.createChannel();

        // Declare a queue
        const queueName = 'hello_queue';
        await channel.assertQueue(queueName, { durable: true });

        // Send a message to the queue
        await channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`[x] Sent '${message}'`);

        // Close the channel and connection
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in producer:', error);
    }
};

runProducer();
