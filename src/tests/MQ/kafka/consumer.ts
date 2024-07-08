import { Kafka, logLevel } from 'kafkajs';

// Create an instance of Kafka
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.NOTHING
});

// Create a Kafka consumer
const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
    // Connect the consumer
    await consumer.connect();

    // Subscribe to the topic
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    // Run the consumer and process each message
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value !== null && message.value !== undefined) {
                console.log({
                    value: message.value.toString(),
                });
            } else {
                console.error('Received message with null value');
            }
        },
    });
};

// Execute the consumer
runConsumer().catch(console.error);

