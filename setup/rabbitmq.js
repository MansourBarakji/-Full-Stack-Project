const amqp = require("amqplib");
const { RABBIT_MQ_QUEUES } = require("../constants/queue");
const orderService = require("../service/orderService");

let connection;
let channel;
async function connectQueue() {
  try {
    connection = await amqp.connect(process.env.RABBIT_MQ_URI);
    channel = await connection.createChannel();

    await channel.assertQueue(RABBIT_MQ_QUEUES.ORDER, {
      durable: true,
    });

    /**
     * If you don't set the prefetch count in RabbitMQ,
     * the default behavior is to allow the consumer to receive as many messages as RabbitMQ can deliver.
     * This means that the consumer could be flooded with messages, leading to potential issues
     */

    /**
     * we can increase prefetch as number of messages increases
     **/

    await channel.prefetch(1);

    channel.consume(RABBIT_MQ_QUEUES.ORDER, async (message) => {
      console.log("Received message from queue");
      console.log(message.content.toString());
      const messageContent = JSON.parse(message.content.toString());
      if (messageContent.type === "createCart") {
        await orderService.createCart(messageContent);
      } else if (messageContent.type === "completeOrder") {
        await orderService.completeOrder(messageContent);
      } else if (messageContent.type === "cancelOrder") {
        await orderService.cancelOrder(messageContent);
      } else if (messageContent.type === "restoreOrder") {
        await orderService.restoreOrder(messageContent);
      } else if (messageContent.type === "deleteOrder") {
        await orderService.deleteOrder(messageContent);
      }
      channel.ack(message);
    });
  } catch (error) {
    console.log(error);
  }
}

async function sendMessage(queue, message) {
  try {
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.log(error);
  }
}

module.exports.rabbitMQ = {
  connectQueue,
  sendMessage,
};
