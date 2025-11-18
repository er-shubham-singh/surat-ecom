// utils/mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USR_EMAIL,
    pass: process.env.BREVIO_SMTP_KEY_VALUE,
  },
});

async function sendOrderConfirmationEmail(to, order) {
  const itemsList = order.orderItems
    .map(
      (item) =>
        `<li>${item.product.title} - Qty: ${item.quantity}, Price: ₹${item.product.price}</li>`
    )
    .join("");

  const htmlContent = `
    <h2>Thank you for your order, ${order.user.firstName}!</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Status:</strong> ${order.orderStatus}</p>
    <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
    <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
    <p><strong>Discounted Price:</strong> ₹${order.totalDiscountedPrice}</p>
    <p><strong>Shipping Address:</strong><br>
      ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
      ${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}
    </p>
    <p><strong>Items:</strong></p>
    <ul>${itemsList}</ul>
  `;
  console.log("EMAIL DEBUG >> sending to:", to);
console.log("EMAIL CONTENT >>", htmlContent);


  try {
    const info = await transporter.sendMail({
      from: `"Fluteon" <${process.env.BREVO_USR_EMAIL}>`,
      to,
      subject: "Order Confirmation - Fluteon",
      html: htmlContent,
    });
    console.log("✅ Email sent successfully:", info.messageId || info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
}

module.exports = { sendOrderConfirmationEmail };
