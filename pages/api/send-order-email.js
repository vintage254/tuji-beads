// This is a placeholder for a real email sending API
// In a production environment, you would use a service like SendGrid, Mailgun, etc.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, subject, orderDetails } = req.body;

    // In a real implementation, you would use an email service here
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // 
    // const msg = {
    //   to,
    //   from: 'your-verified-sender@example.com',
    //   subject,
    //   text: `New order received from ${orderDetails.customer.name}`,
    //   html: generateOrderEmailHtml(orderDetails),
    // };
    // 
    // await sgMail.send(msg);

    console.log(`Email would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Order details: ${JSON.stringify(orderDetails)}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}

function generateOrderEmailHtml(orderDetails) {
  const { orderId, customer, items, totalAmount, orderDate } = orderDetails;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">KSH ${item.price}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">KSH ${item.price * item.quantity}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Order Received</h2>
      <p>You have received a new order from ${customer.name}.</p>
      
      <h3 style="color: #333;">Order Details</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${new Date(orderDate).toLocaleString()}</p>
      
      <h3 style="color: #333;">Customer Information</h3>
      <p><strong>Name:</strong> ${customer.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      
      <h3 style="color: #333;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>KSH ${totalAmount}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <p>Thank you for using Tuji Beads.</p>
    </div>
  `;
}
