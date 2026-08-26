const amqp = require("amqplib");

const Notification = require("../models/Notification");

const { sendOrderConfirmationEmail } = require("../services/emailService");

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672";

const EXCHANGE_NAME = "cake-delight";
const QUEUE_NAME = "notification-queue";
const ROUTING_KEY = "order.completed";

async function startNotificationConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);

    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true,
    });

    const queue = await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    await channel.bindQueue(queue.queue, EXCHANGE_NAME, ROUTING_KEY);

    console.log("Connected to RabbitMQ");
    console.log("Waiting for order.completed events...");

    channel.consume(queue.queue, async (msg) => {
      if (!msg) {
        return;
      }

      try {
        const data = JSON.parse(msg.content.toString());

        console.log("Order completed event received:", data);

        // Save Notification In Database

        await Notification.create({
          orderId: data.orderId,
          customerName: data.customerName,
          message: data.message,
          status: "SENT",
        });

        console.log(`Notification saved for order ${data.orderId}`);

        // Send Order Confirmation Email
        try {
          await sendOrderConfirmationEmail(data);
        } catch (emailError) {
          console.error("Email sending failed:", emailError.message);
        }

        // Acknowledge RabbitMQ Message
        channel.ack(msg);
      } catch (error) {
        console.error("Failed to process notification:", error.message);

        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);

    setTimeout(startNotificationConsumer, 5000);
  }
}

module.exports = {
  startNotificationConsumer,
};
