const amqp = require("amqplib");

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672";

const EXCHANGE_NAME = "cake-delight";
const ROUTING_KEY = "order.completed";

async function publishOrderCompleted(orderData) {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  try {
    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true,
    });

    const message = {
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      deliveryAddress: orderData.deliveryAddress,
      totalAmount: orderData.totalAmount,
      items: orderData.items,
      message: "Your cake order has been placed successfully.",
    };

    channel.publish(
      EXCHANGE_NAME,
      ROUTING_KEY,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
        contentType: "application/json",
      },
    );

    console.log("ORDER_COMPLETED event published");
    console.log("Event data:", message);
  } finally {
    setTimeout(async () => {
      try {
        await channel.close();
        await connection.close();
      } catch (error) {
        console.log("RabbitMQ close warning:", error.message);
      }
    }, 500);
  }
}

module.exports = {
  publishOrderCompleted,
};
