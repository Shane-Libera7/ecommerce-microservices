const amqp = require('amqplib');

async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    return channel;

};