const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 465),
  secure: process.env.MAIL_SECURE === "true",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendOrderConfirmationEmail(order) {
  if (!order.customerEmail) {
    console.log("Customer email not provided. Email not sent.");
    return;
  }

  const itemsHtml = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${item.cakeName}
          </td>

          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${item.quantity}
          </td>

          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ₹${item.price}
          </td>
        </tr>
      `,
    )
    .join("");

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,

    to: order.customerEmail,

    subject: `Your CakeDelight order #${order.orderId} is confirmed!`,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          color: #333;
          line-height: 1.6;
        "
      >

        <h2 style="color: #6A0DAD;">
          Your CakeDelight order #${order.orderId} is confirmed!
        </h2>

        <p>
          Hi <strong>${order.customerName}</strong>,
        </p>

        <p>
          Your CakeDelight order
          <strong>#${order.orderId}</strong>
          is confirmed!
        </p>

        <h3>Order Details</h3>

        <table
          style="
            width: 100%;
            border-collapse: collapse;
          "
        >
          <thead>
            <tr style="background: #f7f0ff;">
              <th style="padding: 8px; text-align: left;">
                Cake
              </th>

              <th style="padding: 8px; text-align: left;">
                Quantity
              </th>

              <th style="padding: 8px; text-align: left;">
                Price
              </th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p>
          <strong>
            Total: ₹${order.totalAmount}
          </strong>
        </p>

        <p>
          <strong>Delivery address:</strong>
          ${order.deliveryAddress || "Not provided"}
        </p>

        <p>
          <strong>Estimated delivery:</strong>
          2-5 working days
        </p>

        <p>
          Track it anytime on the CakeDelight homepage
          under "My Orders" using your order ID.
        </p>

        <p>
          Thanks for ordering with CakeDelight!
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  console.log(`✅ Order confirmation email sent to ${order.customerEmail}`);
}

module.exports = {
  sendOrderConfirmationEmail,
};
